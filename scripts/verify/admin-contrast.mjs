import assert from "node:assert/strict";

/**
 * Solid-surface contrast for the private workspace. This supplements the public
 * screenshot/pixel suite; it does not replace that suite's image/gradient checks.
 *
 * Text colours, solid ancestor backgrounds and opacity groups are composited in
 * the browser. Unsupported paint fails explicitly rather than silently passing.
 * Diagnostics contain element/style metadata only, never text, form values,
 * customer data, URLs, cookies or headers.
 */
export async function assertAdminContrast(page) {
  const report = await page.evaluate(() => {
    const result = { checked: 0, hidden: 0, failures: [], unsupported: [] };
    const rounded = (value) => Math.round(value * 1000) / 1000;

    function colour(value) {
      const rgb = value.match(/^rgba?\(([^)]+)\)$/i);
      if (rgb) {
        const parts = rgb[1].replaceAll(",", " ").replace("/", " ").trim().split(/\s+/);
        if (parts.length < 3) return null;
        const components = parts
          .slice(0, 3)
          .map((part) => Number.parseFloat(part) * (part.endsWith("%") ? 2.55 : 1));
        const alpha =
          parts[3] === undefined
            ? 1
            : Number.parseFloat(parts[3]) / (parts[3].endsWith("%") ? 100 : 1);
        return [...components, alpha].every(Number.isFinite) ? [...components, alpha] : null;
      }
      const srgb = value.match(/^color\(srgb\s+([^)]+)\)$/i);
      if (srgb) {
        const parts = srgb[1].replace("/", " ").trim().split(/\s+/);
        const components = parts
          .slice(0, 3)
          .map((part) => Number.parseFloat(part) * (part.endsWith("%") ? 2.55 : 255));
        const alpha =
          parts[3] === undefined
            ? 1
            : Number.parseFloat(parts[3]) / (parts[3].endsWith("%") ? 100 : 1);
        return components.length === 3 && [...components, alpha].every(Number.isFinite)
          ? [...components, alpha]
          : null;
      }
      return null;
    }

    function over(top, bottom) {
      const alpha = top[3] + bottom[3] * (1 - top[3]);
      if (!alpha) return [0, 0, 0, 0];
      return [
        ...top
          .slice(0, 3)
          .map(
            (component, index) =>
              (component * top[3] + bottom[index] * bottom[3] * (1 - top[3])) / alpha,
          ),
        alpha,
      ];
    }

    function luminance(value) {
      const [r, g, b] = value.slice(0, 3).map((component) => {
        const normalized = Math.max(0, Math.min(255, component)) / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function hidden(element, rects) {
      if (!rects.some((rect) => rect.width > 0 && rect.height > 0 && rect.bottom > 0)) return true;
      if (element.closest('[aria-hidden="true"], [hidden], script, style, noscript, template, svg'))
        return true;
      for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
        const style = getComputedStyle(ancestor);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          style.visibility === "collapse" ||
          Number(style.opacity) === 0
        )
          return true;
        const box = ancestor.getBoundingClientRect();
        // Screen-reader-only content has text ranges despite its clipped box.
        if (
          (style.clip !== "auto" && style.clip !== "") ||
          (box.width <= 1 &&
            box.height <= 1 &&
            [style.overflow, style.overflowX, style.overflowY].includes("hidden"))
        )
          return true;
        if (style.clipPath !== "none" && box.width <= 1 && box.height <= 1) return true;
      }
      return false;
    }

    function inspect(element, rects, pseudo = null) {
      if (hidden(element, rects)) {
        result.hidden++;
        return;
      }
      const style = getComputedStyle(element, pseudo);
      const fontSize = Number.parseFloat(style.fontSize);
      if (!Number.isFinite(fontSize) || fontSize <= 0) {
        result.hidden++;
        return;
      }
      const fontWeight =
        style.fontWeight === "bold" ? 700 : Number.parseFloat(style.fontWeight) || 400;
      const minimum = fontSize >= 24 || (fontSize >= 18.6666667 && fontWeight >= 700) ? 3 : 4.5;
      const metadata = {
        tag: element.tagName.toLowerCase(),
        fontSize: rounded(fontSize),
        fontWeight,
        minimum,
      };
      let foreground = colour(style.color);
      let background = [0, 0, 0, 0];
      if (!foreground) {
        if (result.unsupported.length < 12)
          result.unsupported.push({ ...metadata, reason: "unsupported text colour" });
        return;
      }
      if (pseudo) foreground[3] *= Number(style.opacity);

      for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
        const ancestorStyle = getComputedStyle(ancestor);
        if (
          ancestorStyle.filter !== "none" ||
          ancestorStyle.mixBlendMode !== "normal" ||
          (ancestorStyle.backdropFilter && ancestorStyle.backdropFilter !== "none") ||
          (background[3] < 1 && ancestorStyle.backgroundImage !== "none")
        ) {
          if (result.unsupported.length < 12)
            result.unsupported.push({
              ...metadata,
              reason: "non-solid or filtered paint; pixel check required",
            });
          return;
        }
        const ground = colour(ancestorStyle.backgroundColor);
        if (!ground) {
          if (result.unsupported.length < 12)
            result.unsupported.push({ ...metadata, reason: "unsupported background colour" });
          return;
        }
        // Work from the text outward, so an opaque child shields a parent's
        // background before that parent's group opacity is applied.
        foreground = over(foreground, ground);
        background = over(background, ground);
        const opacity = Number(ancestorStyle.opacity);
        foreground[3] *= opacity;
        background[3] *= opacity;
      }
      const canvas = [255, 255, 255, 1];
      foreground = over(foreground, canvas);
      background = over(background, canvas);
      const a = luminance(foreground);
      const b = luminance(background);
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      result.checked++;
      if (ratio + 1e-6 < minimum && result.failures.length < 12)
        result.failures.push({
          ...metadata,
          ratio: rounded(ratio),
          foreground: foreground.slice(0, 3).map(rounded),
          background: background.slice(0, 3).map(rounded),
        });
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent?.trim() || !node.parentElement) continue;
      // Native select options are painted by the control, not as child text.
      if (node.parentElement.closest("select, textarea, option")) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      inspect(node.parentElement, [...range.getClientRects()]);
    }

    for (const control of document.querySelectorAll(
      'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]), select, textarea',
    )) {
      const rects = [...control.getClientRects()];
      if (control.tagName === "SELECT" || control.value) inspect(control, rects);
      else if (control.getAttribute("placeholder")) inspect(control, rects, "::placeholder");
    }
    return result;
  });

  assert.ok(report.checked > 0, "Admin contrast: no visible rendered text was measured");
  assert.equal(
    report.unsupported.length,
    0,
    `Admin contrast: unsupported paint needs a pixel check: ${JSON.stringify(report.unsupported)}`,
  );
  assert.equal(
    report.failures.length,
    0,
    `Admin contrast: rendered text below WCAG AA: ${JSON.stringify(report.failures)}`,
  );
  return { checked: report.checked, hidden: report.hidden };
}
