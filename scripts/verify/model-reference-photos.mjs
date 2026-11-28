export async function verifyModelReferencePhotos(browser, base, fail) {
  /* T14's family page has two labelled generations; Carbon and 5410 each have
   * one. Keep the no-redundant-controls rule for actual single-photo galleries. */
  const referencePhotoModels = [
    {
      slug: "lenovo-thinkpad-t14",
      name: "Lenovo ThinkPad T14",
      photos: [
        {
          src: "/models/t14/gen1-amd-front-reference.jpg",
          alt: "ThinkPad T14 Gen 1 AMD",
          author: "LaptopMedia",
          source: "https://www.youtube.com/watch?v=eHQjbtcbt1g",
          licence: "CC BY 3.0 (video frame)",
          licenceUrl: "https://creativecommons.org/licenses/by/3.0/",
        },
        {
          src: "/models/t14/gen2-intel-reference.webp",
          alt: "ThinkPad T14 Gen 2 Intel",
          author: "Edvard10",
          source: "https://commons.wikimedia.org/wiki/File:ThinkPad_T14.jpg",
          licence: "CC0",
          licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
        },
      ],
    },
    {
      slug: "lenovo-thinkpad-x1-carbon",
      name: "Lenovo ThinkPad X1 Carbon",
      photos: [
        {
          src: "/models/x1-carbon/gen8-front-reference.jpg",
          alt: "ThinkPad X1 Carbon Gen 8",
          author: "LaptopMedia",
          source: "https://www.youtube.com/watch?v=Dkzl9vMPP9w",
          licence: "CC BY 3.0 (video frame)",
          licenceUrl: "https://creativecommons.org/licenses/by/3.0/",
        },
      ],
    },
    {
      slug: "dell-latitude-5410",
      name: "Dell Latitude 5410",
      photos: [
        {
          src: "/models/latitude-5410/front-reference.jpg",
          alt: "Dell Latitude 5410",
          author: "LaptopMedia",
          source: "https://www.youtube.com/watch?v=GfeEm279CrE",
          licence: "CC BY 3.0 (video frame)",
          licenceUrl: "https://creativecommons.org/licenses/by/3.0/",
        },
      ],
    },
  ];

  async function referencePhotoIntact(image, expected) {
    return image.evaluate(async (img, photo) => {
      try {
        await img.decode();
      } catch {
        return false;
      }
      const url = new URL(img.currentSrc || img.src, location.href);
      const source = url.pathname === "/_next/image" ? url.searchParams.get("url") : url.pathname;
      const style = getComputedStyle(img);
      return (
        source === photo.src &&
        img.alt.includes(photo.alt) &&
        img.complete &&
        img.naturalWidth > 0 &&
        Math.abs(img.naturalWidth / img.naturalHeight - 4 / 3) < 0.01 &&
        style.objectFit === "contain" &&
        style.mixBlendMode === "normal"
      );
    }, expected);
  }

  /* These pages are Danish, and so is the note after the licence name
     (lib/credits.ts). */
  const danishLicence = (licence) =>
    licence
      .replace("(video frame)", "(stillbillede fra video)")
      .replace("(resized)", "(formindsket)")
      .replace("(trimmed)", "(beskåret)");

  for (const width of [320, 390, 1440]) {
    for (const model of referencePhotoModels) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      const label = `${model.slug} at ${width}px`;
      await page.goto(base + `/modeller/${model.slug}`, { waitUntil: "networkidle" });
      await page.getByRole("button", { name: "Kun nødvendige", exact: true }).click();
      const enlarge = page.getByRole("button", {
        name: `Forstør billede af ${model.name}`,
        exact: true,
      });
      const gallery = enlarge.locator("..");
      const photos = gallery.getByRole("group", { name: "Produktbilleder", exact: true });
      if (model.photos.length === 1) {
        if (await photos.count())
          fail("reference photo", `single photograph has redundant thumbnail controls: ${label}`);
      } else if (
        (await photos.count()) !== 1 ||
        (await photos.getByRole("button").count()) !== model.photos.length
      ) {
        fail("reference photo", `incorrect family-photo thumbnail count: ${label}`);
      }

      for (const [index, photo] of model.photos.entries()) {
        if (model.photos.length > 1) {
          const thumbnail = photos.getByRole("button").nth(index);
          await thumbnail.click();
          if ((await thumbnail.getAttribute("aria-pressed")) !== "true")
            fail("reference photo", `photo ${index + 1} selection did not update: ${label}`);
        }
        if (!(await referencePhotoIntact(enlarge.locator("img"), photo)))
          fail(
            "reference photo",
            `photo ${index + 1} missing, mismatched or cropped/blended: ${label}`,
          );
        const source = gallery.locator(`a[href='${photo.source}']`);
        const licence = gallery.locator("a[rel='license']");
        if (
          (await source.count()) !== 1 ||
          !(await source.isVisible()) ||
          !(await source.innerText()).includes(photo.author) ||
          (await licence.count()) !== 1 ||
          !(await licence.isVisible()) ||
          (await licence.getAttribute("href")) !== photo.licenceUrl ||
          (await licence.innerText()) !== danishLicence(photo.licence)
        )
          fail(
            "reference photo",
            `photo ${index + 1} visible attribution/licence mismatch: ${label}`,
          );
        await enlarge.click();
        const zoom = page.locator("dialog[open]");
        await zoom.waitFor();
        const box = await zoom.boundingBox();
        if (!box || box.x < 0 || box.x + box.width > width + 1)
          fail("reference photo", `zoom overflows: ${label}`);
        if (!(await referencePhotoIntact(zoom.locator("img"), photo)))
          fail("reference photo", `zoom photo ${index + 1} lost its complete source: ${label}`);
        for (const name of ["Forrige billede", "Næste billede"]) {
          const count = await zoom.getByRole("button", { name, exact: true }).count();
          if (count !== (model.photos.length > 1 ? 1 : 0))
            fail("reference photo", `incorrect ${name} control count: ${label}`);
        }
        if (model.photos.length > 1 && index === 0) {
          await page.keyboard.press("ArrowRight");
          if (!(await referencePhotoIntact(zoom.locator("img"), model.photos[1])))
            fail("reference photo", `zoom keyboard next photo did not update: ${label}`);
          await page.keyboard.press("ArrowLeft");
          if (!(await referencePhotoIntact(zoom.locator("img"), photo)))
            fail("reference photo", `zoom keyboard previous photo did not update: ${label}`);
        }
        await page.keyboard.press("Escape");
        await page.waitForFunction(
          () => !document.querySelector("dialog").open && document.body.style.overflow !== "hidden",
        );
        if (!(await enlarge.evaluate((el) => el === document.activeElement)))
          fail("reference photo", `focus did not return: ${label}`);
      }
      if (model.photos.length > 1) {
        await photos.getByRole("button").last().focus();
        for (const [key, index] of [
          ["Home", 0],
          ["End", model.photos.length - 1],
        ]) {
          await page.keyboard.press(key);
          const thumbnail = photos.getByRole("button").nth(index);
          if (
            (await thumbnail.getAttribute("aria-pressed")) !== "true" ||
            !(await thumbnail.evaluate((element) => element === document.activeElement)) ||
            !(await referencePhotoIntact(enlarge.locator("img"), model.photos[index]))
          )
            fail(
              "reference photo",
              `thumbnail keyboard ${key} did not select/focus photo: ${label}`,
            );
        }
      }
      await context.close();
    }
  }
}
