"""
The category cards, path-traced in the hero photograph's own room.

    python scene.py <card> <out.png> [--quick]

Run through scripts/build/cards-cycles/render.mjs, which prepares the window
plate and converts the result. Needs the `bpy` wheel (Blender as a Python
module, which ships Cycles with Open Image Denoise):

    uv venv -p python3.11 /opt/bpyenv/.venv
    uv pip install --python /opt/bpyenv/.venv/bin/python bpy

Why this exists: the first card is a crop of the hero photograph — a laptop
on a marble desk in front of a blue-hour window — and the other three were
rasterised in a black studio and fogged over a darkened crop. Next to a
photograph that reads as CGI however good the models are, because the
difference is not the models. It is that one of them has a room and the rest
do not: no surface the object stands on, nothing behind it at a distance,
no light that has bounced off anything. So this builds the room once — the
stone desk, the window with the hero's own view in it, a warm key from the
left — and puts each subject on the same desk under the same light.

Units are metres. The desk surface is z = 0; the camera looks along +y.
"""

import math
import os
import sys

import bpy  # first: bmesh and mathutils only exist once bpy is loaded
import bmesh
from mathutils import Vector

ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
CARD = ARGS[0] if ARGS else "cat-desktops"
OUT = ARGS[1] if len(ARGS) > 1 else f"/tmp/{CARD}.png"
QUICK = "--quick" in sys.argv
HERE = os.path.dirname(os.path.abspath(__file__))
PLATE = os.environ.get("KESTRO_WINDOW_PLATE", os.path.join(HERE, "window.png"))

# How bright the window is, for every card. Measured, not chosen: the hero
# photograph's own window sits at luminance 135 and the room around it at 39,
# and the first set of renders had the window at 1.45 — a sky nearly white,
# the brightest thing on each card, and cooler than the key. check-cards.mjs
# read that as a blue key and an exposure 30-70 points over the hero's.
WINDOW = float(os.environ.get("KESTRO_WINDOW", "0.68"))
WALLPAPER = os.environ.get("KESTRO_WALLPAPER", os.path.join(HERE, "wallpaper.png"))


# --------------------------------------------------------------------- scene

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.device = "CPU"
scene.cycles.samples = 48 if QUICK else 512
scene.cycles.use_adaptive_sampling = True
scene.cycles.adaptive_threshold = 0.02 if QUICK else 0.004
scene.cycles.use_denoising = True
scene.cycles.denoiser = "OPENIMAGEDENOISE"
scene.cycles.max_bounces = 8
scene.cycles.glossy_bounces = 4
scene.cycles.transparent_max_bounces = 4
scene.cycles.caustics_reflective = False
scene.cycles.caustics_refractive = False
scene.cycles.blur_glossy = 0.6
# Rendered at 4/3 of the delivery size and downsampled by render.mjs.
SIZE = {"exploded": (1200, 1600), "fleet-scene": (1200, 1800)}.get(CARD, (1600, 900))
scene.render.resolution_x = SIZE[0] // 2 if QUICK else SIZE[0]
scene.render.resolution_y = SIZE[1] // 2 if QUICK else SIZE[1]
scene.render.resolution_percentage = 100
scene.render.film_transparent = False
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_depth = "16"
scene.view_settings.view_transform = "AgX"
for look in ("AgX - Medium High Contrast", "Medium High Contrast", "AgX - Base Contrast"):
    try:
        scene.view_settings.look = look
        break
    except TypeError:
        pass
scene.view_settings.exposure = 0.0

world = bpy.data.worlds.new("room")
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.004, 0.006, 0.012, 1)
bg.inputs["Strength"].default_value = 1.0
scene.world = world


# ----------------------------------------------------------------- materials


def srgb(hexstr):
    """#rrggbb to linear RGBA, because Blender's colour inputs are linear."""
    h = hexstr.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i : i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, 1.0)


def principled(name, base, rough, metal=0.0, spec=0.5, coat=0.0, coat_rough=0.1, aniso=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = srgb(base) if isinstance(base, str) else base
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    p.inputs["Specular IOR Level"].default_value = spec
    p.inputs["Coat Weight"].default_value = coat
    p.inputs["Coat Roughness"].default_value = coat_rough
    p.inputs["Anisotropic"].default_value = aniso
    return m


def with_grain(m, scale=900.0, strength=0.06, rough_spread=0.08):
    """
    Micro-texture: the difference between a moulded part and a render of one.

    Soft-touch plastic and bead-blasted aluminium both have a fine grain that
    breaks a highlight up into something that reads as a surface. A perfectly
    smooth Principled material catches a highlight like wet paint.
    """
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = scale
    noise.inputs["Detail"].default_value = 2.0
    nt.links.new(tc.outputs["Object"], noise.inputs["Vector"])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = strength
    bump.inputs["Distance"].default_value = 0.0004
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])
    base_r = p.inputs["Roughness"].default_value
    rng = nt.nodes.new("ShaderNodeMapRange")
    rng.inputs["To Min"].default_value = max(0.0, base_r - rough_spread)
    rng.inputs["To Max"].default_value = min(1.0, base_r + rough_spread)
    nt.links.new(noise.outputs["Fac"], rng.inputs["Value"])
    nt.links.new(rng.outputs["Result"], p.inputs["Roughness"])
    return m


def emission(name, colour, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    e = nt.nodes.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = srgb(colour)
    e.inputs["Strength"].default_value = strength
    nt.links.new(e.outputs["Emission"], out.inputs["Surface"])
    return m


# The palette. Business hardware is not black; it is four or five different
# near-blacks, and a card where every part is the same #111 is what "render"
# looks like. Values sampled against the hero plate's laptop body (#161e25).
SOFT_TOUCH = with_grain(principled("soft-touch", "#15171b", 0.58, spec=0.35), 1400, 0.05)
SATIN = with_grain(principled("satin", "#1b1e23", 0.42, spec=0.45), 1100, 0.04)
GRAPHITE = with_grain(
    principled("graphite-alu", "#6a7079", 0.34, metal=1.0, aniso=0.35), 2200, 0.03, 0.05
)
GRAPHITE_DARK = with_grain(
    principled("graphite-alu-dark", "#33373e", 0.36, metal=1.0, aniso=0.3), 2200, 0.03, 0.05
)
GUNMETAL = with_grain(principled("gunmetal", "#2c3036", 0.3, metal=1.0), 1800, 0.03, 0.04)
RUBBER = principled("rubber", "#08090a", 0.85, spec=0.2)
PORT = principled("port", "#020203", 0.7, spec=0.2)
PORT_TONGUE = principled("port-tongue", "#1d2a4a", 0.5, spec=0.3)
CHROME_EDGE = principled("chamfer", "#8a919b", 0.22, metal=1.0)
LED_BLUE = emission("led", "#5b86ff", 14.0)
LED_WHITE = emission("led-white", "#e8eeff", 6.0)


def glass_screen(name, wallpaper=None, glow=0.0):
    """
    A display in a lit room: a near-black dielectric under a smooth coat,
    so it mirrors the window in front of it. Optionally the wallpaper the
    hero's laptop shows, at a fraction of its own brightness.
    """
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    p.inputs["Base Color"].default_value = srgb("#030406")
    p.inputs["Roughness"].default_value = 0.35
    p.inputs["Specular IOR Level"].default_value = 0.2
    p.inputs["Coat Weight"].default_value = 1.0
    p.inputs["Coat Roughness"].default_value = 0.03
    p.inputs["Coat IOR"].default_value = 1.52
    if wallpaper and os.path.exists(wallpaper):
        tex = nt.nodes.new("ShaderNodeTexImage")
        tex.image = bpy.data.images.load(wallpaper)
        tex.extension = "EXTEND"
        uv = nt.nodes.new("ShaderNodeTexCoord")
        nt.links.new(uv.outputs["UV"], tex.inputs["Vector"])
        nt.links.new(tex.outputs["Color"], p.inputs["Emission Color"])
        p.inputs["Emission Strength"].default_value = glow
    return m


def marble():
    """
    The desk, after the hero plate: near-black stone with a fine white crackle,
    polished enough to carry the window in it.

    The crackle is distance-to-edge Voronoi on a noise-warped coordinate —
    straight cell edges are tile, warped ones are stone.
    """
    m = bpy.data.materials.new("stone")
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    warp = nt.nodes.new("ShaderNodeTexNoise")
    warp.inputs["Scale"].default_value = 2.2
    warp.inputs["Detail"].default_value = 6.0
    nt.links.new(tc.outputs["Object"], warp.inputs["Vector"])
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "VECTOR"
    mix.inputs["Factor"].default_value = 0.55
    nt.links.new(tc.outputs["Object"], mix.inputs[4])
    nt.links.new(warp.outputs["Color"], mix.inputs[5])
    vor = nt.nodes.new("ShaderNodeTexVoronoi")
    vor.feature = "DISTANCE_TO_EDGE"
    vor.inputs["Scale"].default_value = 3.6
    nt.links.new(mix.outputs[1], vor.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = srgb("#20252c")
    ramp.color_ramp.elements[1].position = 0.0045
    ramp.color_ramp.elements[1].color = srgb("#141922")
    nt.links.new(vor.outputs["Distance"], ramp.inputs["Fac"])
    cloud = nt.nodes.new("ShaderNodeTexNoise")
    cloud.inputs["Scale"].default_value = 5.0
    cloud.inputs["Detail"].default_value = 8.0
    nt.links.new(tc.outputs["Object"], cloud.inputs["Vector"])
    tone = nt.nodes.new("ShaderNodeMix")
    tone.data_type = "RGBA"
    tone.blend_type = "MULTIPLY"
    tone.inputs["Factor"].default_value = 0.35
    nt.links.new(ramp.outputs["Color"], tone.inputs[6])
    nt.links.new(cloud.outputs["Color"], tone.inputs[7])
    nt.links.new(tone.outputs[2], p.inputs["Base Color"])
    rough = nt.nodes.new("ShaderNodeMapRange")
    rough.inputs["To Min"].default_value = 0.1
    rough.inputs["To Max"].default_value = 0.24
    nt.links.new(cloud.outputs["Fac"], rough.inputs["Value"])
    nt.links.new(rough.outputs["Result"], p.inputs["Roughness"])
    p.inputs["Specular IOR Level"].default_value = 0.55
    return m


# ----------------------------------------------------------------- geometry


def _finish(obj, bevel, segments, material, sharp_angle=30):
    me = obj.data
    for poly in me.polygons:
        poly.use_smooth = True
    try:
        me.set_sharp_from_angle(angle=math.radians(sharp_angle))
    except AttributeError:
        pass
    if bevel > 0:
        mod = obj.modifiers.new("edge", "BEVEL")
        mod.width = bevel
        mod.segments = segments
        mod.limit_method = "ANGLE"
        mod.angle_limit = math.radians(sharp_angle)
        mod.harden_normals = True
        mod.use_clamp_overlap = True
    if material:
        me.materials.append(material)
    return obj


def slab(name, w, d, h, loc=(0, 0, 0), corner=0.0, bevel=0.0015, segments=3, material=None,
         rot_z=0.0, parent=None):
    """
    A box with rounded corners in plan and softened edges, sitting on its
    base at loc. Everything a business machine is made of is some version of
    this; the corner radius and the edge radius are the whole product design.
    """
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= w
        v.co.y *= d
        v.co.z = (v.co.z + 0.5) * h
    if corner > 0:
        vertical = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > h * 0.5]
        bmesh.ops.bevel(
            bm, geom=vertical, offset=min(corner, w / 2.01, d / 2.01), segments=10,
            profile=0.5, affect="EDGES",
        )
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    obj.rotation_euler.z = rot_z
    if parent:
        obj.parent = parent
    return _finish(obj, bevel, segments, material)


def cylinder(name, r, depth, loc, axis="y", material=None, segments=48, parent=None, bevel=0.0004):
    bm = bmesh.new()
    bmesh.ops.create_cone(
        bm, cap_ends=True, cap_tris=False, segments=segments, radius1=r, radius2=r, depth=depth
    )
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    if axis == "y":
        obj.rotation_euler.x = math.radians(90)
    elif axis == "x":
        obj.rotation_euler.y = math.radians(90)
    if parent:
        obj.parent = parent
    return _finish(obj, bevel, 2, material, sharp_angle=40)


def torus(name, major, minor, loc, material, parent=None, axis="y"):
    bm = bmesh.new()
    segs, rings = 64, 12
    verts = []
    for i in range(segs):
        a = 2 * math.pi * i / segs
        ring = []
        for j in range(rings):
            b = 2 * math.pi * j / rings
            x = (major + minor * math.cos(b)) * math.cos(a)
            y = (major + minor * math.cos(b)) * math.sin(a)
            z = minor * math.sin(b)
            ring.append(bm.verts.new((x, y, z)))
        verts.append(ring)
    for i in range(segs):
        for j in range(rings):
            bm.faces.new(
                (verts[i][j], verts[(i + 1) % segs][j], verts[(i + 1) % segs][(j + 1) % rings],
                 verts[i][(j + 1) % rings])
            )
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for poly in me.polygons:
        poly.use_smooth = True
    obj = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    if axis == "y":
        obj.rotation_euler.x = math.radians(90)
    me.materials.append(material)
    if parent:
        obj.parent = parent
    return obj


def group(name, loc=(0, 0, 0), rot_z=0.0):
    e = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(e)
    e.location = loc
    e.rotation_euler.z = rot_z
    return e


def port_usb_a(name, x, z, face_y, parent, horizontal=True):
    w, h = (0.0125, 0.0048) if horizontal else (0.0048, 0.0125)
    slab(name, w, 0.006, h, (x, face_y + 0.0028, z - h / 2), corner=0.0006, bevel=0.0003,
         material=PORT, parent=parent)
    tw, th = (w * 0.78, h * 0.32) if horizontal else (w * 0.32, h * 0.78)
    slab(name + "-t", tw, 0.004, th, (x, face_y + 0.0012, z - th / 2 + (h * 0.12 if horizontal else 0)),
         bevel=0.0001, material=PORT_TONGUE, parent=parent)


def port_usb_c(name, x, z, face_y, parent):
    slab(name, 0.0089, 0.006, 0.0032, (x, face_y + 0.0028, z - 0.0016), corner=0.0015,
         bevel=0.0002, material=PORT, parent=parent)


def jack(name, x, z, face_y, parent):
    cylinder(name, 0.0019, 0.006, (x, face_y + 0.0025, z), axis="y", material=PORT, parent=parent)


# ------------------------------------------------------------------ the room


def room(desk_back=0.9, window_y=2.6, window_z=-0.35, window_w=5.2, window_h=2.9, plate_strength=2.2,
         window_x=0.0):
    """
    The desk, the dark gap behind it, and the window.

    The window is the hero plate's own view — sky, mullion, the lit town on the
    water — on an emissive card far enough behind the subject that the lens
    turns the lights into the same soft discs the laptop card has. It is also
    the scene's main light: the rim on every edge and the long reflection in the
    stone both come from it, which is the light the laptop in the photograph is
    standing in.
    """
    if desk_back is not None:
        slab("desk", 4.0, 1.8, 0.04, (0, desk_back - 0.9, -0.04), bevel=0.004, segments=4, material=marble())
    # A shadow line under the desk's front edge so it has a thickness.
    slab("floor", 12, 12, 0.01, (0, 2, -0.8), material=principled("floor", "#050608", 0.6))

    img = bpy.data.images.load(PLATE)
    m = bpy.data.materials.new("window")
    m.use_nodes = True
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    em = nt.nodes.new("ShaderNodeEmission")
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = img
    tex.extension = "MIRROR"
    tc = nt.nodes.new("ShaderNodeTexCoord")
    nt.links.new(tc.outputs["UV"], tex.inputs["Vector"])
    nt.links.new(tex.outputs["Color"], em.inputs["Color"])
    em.inputs["Strength"].default_value = plate_strength
    nt.links.new(em.outputs["Emission"], out.inputs["Surface"])

    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
    uv = bm.loops.layers.uv.new("UVMap")
    for f in bm.faces:
        for loop in f.loops:
            co = loop.vert.co
            loop[uv].uv = (co.x + 0.5, co.y + 0.5)
    me = bpy.data.meshes.new("window")
    bm.to_mesh(me)
    bm.free()
    win = bpy.data.objects.new("window", me)
    bpy.context.collection.objects.link(win)
    win.scale = (window_w, window_h, 1)
    win.rotation_euler.x = math.radians(90)
    win.location = (window_x, window_y, window_z + window_h / 2)
    me.materials.append(m)
    # The window lights the room but must not be seen by shadows as a solid.
    win.visible_shadow = False
    return win


def key_light(loc, target, energy, size=1.4, colour=(1.0, 0.9, 0.8)):
    """Warm tungsten from camera left, per the brief, as a large soft source."""
    data = bpy.data.lights.new("key", "AREA")
    data.shape = "RECTANGLE"
    data.size = size
    data.size_y = size * 0.6
    data.energy = energy
    data.color = colour
    obj = bpy.data.objects.new("key", data)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    direction = Vector(target) - Vector(loc)
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return obj


def rim_light(loc, target, energy, size=2.0, colour=(0.62, 0.72, 1.0)):
    data = bpy.data.lights.new("rim", "AREA")
    data.shape = "RECTANGLE"
    data.size = size
    data.size_y = 0.4
    data.energy = energy
    data.color = colour
    obj = bpy.data.objects.new("rim", data)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    direction = Vector(target) - Vector(loc)
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    return obj


def ceiling(energy, z=2.2, size=(3.0, 2.0), y=0.3):
    """
    The office ceiling: one large dim panel overhead.

    Metal only shows its colour by reflecting something, and with a black room
    above it a graphite lid mirrors black — the stacks of closed laptops came
    back as black slabs whatever their base colour. A real office has a lit
    ceiling, and a soft gradient across every horizontal face is what it gives.
    """
    data = bpy.data.lights.new("ceiling", "AREA")
    data.shape = "RECTANGLE"
    data.size, data.size_y = size
    data.energy = energy
    data.color = (0.9, 0.93, 1.0)
    obj = bpy.data.objects.new("ceiling", data)
    bpy.context.collection.objects.link(obj)
    obj.location = (0, y, z)
    return obj


def camera(loc, target, lens, fstop, focus):
    data = bpy.data.cameras.new("cam")
    data.lens = lens
    data.sensor_width = 36
    data.dof.use_dof = True
    data.dof.aperture_fstop = fstop
    data.dof.aperture_blades = 7
    data.dof.aperture_rotation = math.radians(12)
    cam = bpy.data.objects.new("cam", data)
    bpy.context.collection.objects.link(cam)
    cam.location = loc
    direction = Vector(target) - Vector(loc)
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    f = group("focus", focus)
    data.dof.focus_object = f
    scene.camera = cam
    return cam


# ------------------------------------------------------------------ subjects


def tower(loc, rot_z):
    """
    A business mini-tower, 15.4 x 29.2 x 32.4 cm — the OptiPlex / EliteDesk /
    ThinkCentre envelope, with none of their marks. The front is a separate
    bezel with a perforated field, because that is the one feature every
    business tower has and it is what tells the eye "computer" rather than
    "box" at 290 pixels wide.
    """
    g = group("tower", loc, rot_z)
    W, D, H = 0.154, 0.292, 0.324
    slab("tower-body", W, D, H, (0, 0, 0.006), corner=0.004, bevel=0.002, material=SOFT_TOUCH, parent=g)
    # Front bezel, proud by 6 mm with a shadow gap to the case.
    bez = slab("tower-bezel", W - 0.002, 0.012, H - 0.004, (0, -D / 2 - 0.004, 0.008), corner=0.003,
               bevel=0.0025, material=perforated(), parent=g)
    face_y = -D / 2 - 0.0105
    # Power button with its ring.
    cylinder("pwr", 0.0085, 0.004, (W * 0.18, face_y - 0.0005, H - 0.03), material=SATIN, parent=g)
    torus("pwr-ring", 0.0092, 0.0008, (W * 0.18, face_y - 0.0012, H - 0.03), LED_BLUE, parent=g)
    # The IO strip: two USB-A, a USB-C and the headset jack.
    zt = H - 0.062
    port_usb_a("a1", -W * 0.26, zt, face_y, g)
    port_usb_a("a2", -W * 0.26, zt - 0.012, face_y, g)
    port_usb_c("c1", -W * 0.02, zt - 0.001, face_y, g)
    jack("jk", W * 0.2, zt - 0.001, face_y, g)
    # The seam under the IO panel: where the bezel's top section is a separate
    # moulding on every real tower, and what stops the front reading as one
    # undifferentiated black face at card size.
    slab("tower-seam", W - 0.012, 0.003, 0.0014, (0, face_y + 0.0006, H - 0.086), bevel=0.0002,
         material=PORT, parent=g)
    # Feet.
    for sx in (-1, 1):
        for sy in (-1, 1):
            slab("foot", 0.028, 0.05, 0.006, (sx * (W / 2 - 0.02), sy * (D / 2 - 0.04), 0), corner=0.004,
                 bevel=0.001, material=RUBBER, parent=g)
    return g


def perforated():
    """
    The bezel: satin plastic with a hexagonal field of vent holes in its lower
    two-thirds. Drawn in the shader rather than cut, because at card size a
    hole is a dark dot with a lit lip, and that is what the bump gives.
    """
    m = bpy.data.materials.new("bezel")
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes["Principled BSDF"]
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(tc.outputs["Object"], sep.inputs["Vector"])
    # Hex grid via two offset square grids, in object space (x across, z up).
    def grid(offset_x, offset_z):
        comb = nt.nodes.new("ShaderNodeCombineXYZ")
        mx = nt.nodes.new("ShaderNodeMath")
        mx.operation = "MULTIPLY_ADD"
        mx.inputs[1].default_value = 1 / 0.0052
        mx.inputs[2].default_value = offset_x
        nt.links.new(sep.outputs["X"], mx.inputs[0])
        mz = nt.nodes.new("ShaderNodeMath")
        mz.operation = "MULTIPLY_ADD"
        mz.inputs[1].default_value = 1 / 0.009
        mz.inputs[2].default_value = offset_z
        nt.links.new(sep.outputs["Z"], mz.inputs[0])
        fx = nt.nodes.new("ShaderNodeMath")
        fx.operation = "FRACT"
        nt.links.new(mx.outputs[0], fx.inputs[0])
        fz = nt.nodes.new("ShaderNodeMath")
        fz.operation = "FRACT"
        nt.links.new(mz.outputs[0], fz.inputs[0])
        sx = nt.nodes.new("ShaderNodeMath")
        sx.operation = "SUBTRACT"
        sx.inputs[1].default_value = 0.5
        nt.links.new(fx.outputs[0], sx.inputs[0])
        sz = nt.nodes.new("ShaderNodeMath")
        sz.operation = "SUBTRACT"
        sz.inputs[1].default_value = 0.5
        nt.links.new(fz.outputs[0], sz.inputs[0])
        # Correct the aspect so the holes are round: z pitch is 1.73x x pitch.
        szs = nt.nodes.new("ShaderNodeMath")
        szs.operation = "MULTIPLY"
        szs.inputs[1].default_value = 0.009 / 0.0052
        nt.links.new(sz.outputs[0], szs.inputs[0])
        nt.links.new(sx.outputs[0], comb.inputs["X"])
        nt.links.new(szs.outputs[0], comb.inputs["Y"])
        ln = nt.nodes.new("ShaderNodeVectorMath")
        ln.operation = "LENGTH"
        nt.links.new(comb.outputs[0], ln.inputs[0])
        return ln.outputs["Value"]

    d1 = grid(0.0, 0.0)
    d2 = grid(0.5, 0.5)
    mn = nt.nodes.new("ShaderNodeMath")
    mn.operation = "MINIMUM"
    nt.links.new(d1, mn.inputs[0])
    nt.links.new(d2, mn.inputs[1])
    hole = nt.nodes.new("ShaderNodeMapRange")
    hole.inputs["From Min"].default_value = 0.2
    hole.inputs["From Max"].default_value = 0.26
    hole.inputs["To Min"].default_value = 1.0
    hole.inputs["To Max"].default_value = 0.0
    nt.links.new(mn.outputs[0], hole.inputs["Value"])
    # Confine the field: lower two-thirds, inset from the edges.
    zin = nt.nodes.new("ShaderNodeMapRange")
    zin.interpolation_type = "STEPPED"
    zin.inputs["From Min"].default_value = 0.02
    zin.inputs["From Max"].default_value = 0.215
    zin.inputs["To Min"].default_value = 0
    zin.inputs["To Max"].default_value = 1
    nt.links.new(sep.outputs["Z"], zin.inputs["Value"])
    zmask = nt.nodes.new("ShaderNodeMath")
    zmask.operation = "COMPARE"
    zmask.inputs[1].default_value = 0.1175
    zmask.inputs[2].default_value = 0.0975
    nt.links.new(sep.outputs["Z"], zmask.inputs[0])
    xabs = nt.nodes.new("ShaderNodeMath")
    xabs.operation = "ABSOLUTE"
    nt.links.new(sep.outputs["X"], xabs.inputs[0])
    xmask = nt.nodes.new("ShaderNodeMath")
    xmask.operation = "LESS_THAN"
    xmask.inputs[1].default_value = 0.058
    nt.links.new(xabs.outputs[0], xmask.inputs[0])
    both = nt.nodes.new("ShaderNodeMath")
    both.operation = "MULTIPLY"
    nt.links.new(zmask.outputs[0], both.inputs[0])
    nt.links.new(xmask.outputs[0], both.inputs[1])
    field = nt.nodes.new("ShaderNodeMath")
    field.operation = "MULTIPLY"
    nt.links.new(hole.outputs[0], field.inputs[0])
    nt.links.new(both.outputs[0], field.inputs[1])
    col = nt.nodes.new("ShaderNodeMix")
    col.data_type = "RGBA"
    col.inputs[6].default_value = srgb("#1c1f24")
    col.inputs[7].default_value = srgb("#010102")
    nt.links.new(field.outputs[0], col.inputs["Factor"])
    nt.links.new(col.outputs[2], p.inputs["Base Color"])
    rough = nt.nodes.new("ShaderNodeMapRange")
    rough.inputs["To Min"].default_value = 0.36
    rough.inputs["To Max"].default_value = 0.9
    nt.links.new(field.outputs[0], rough.inputs["Value"])
    nt.links.new(rough.outputs["Result"], p.inputs["Roughness"])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.invert = True
    bump.inputs["Strength"].default_value = 0.6
    bump.inputs["Distance"].default_value = 0.0008
    nt.links.new(field.outputs[0], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])
    p.inputs["Specular IOR Level"].default_value = 0.45
    return m


def mini_pc(loc, rot_z):
    """A 1-litre business mini, 17.9 x 18.2 x 3.65 cm, lying as they are used."""
    g = group("mini", loc, rot_z)
    W, D, H = 0.179, 0.182, 0.0365
    slab("mini-base", W, D, H * 0.62, (0, 0, 0.003), corner=0.006, bevel=0.0015, material=SOFT_TOUCH, parent=g)
    slab("mini-lid", W - 0.001, D - 0.001, H * 0.36, (0, 0, 0.003 + H * 0.62 + 0.0006), corner=0.0058,
         bevel=0.0018, material=GRAPHITE_DARK, parent=g)
    face_y = -D / 2 - 0.0002
    zc = 0.003 + H * 0.33
    cylinder("mpwr", 0.0045, 0.002, (W * 0.38, face_y - 0.0004, zc), material=SATIN, parent=g)
    torus("mpwr-ring", 0.0049, 0.0005, (W * 0.38, face_y - 0.0008, zc), LED_WHITE, parent=g)
    port_usb_a("ma1", -W * 0.34, zc + 0.0024, face_y, g)
    port_usb_c("mc1", -W * 0.2, zc + 0.0016, face_y, g)
    jack("mjk", -W * 0.1, zc, face_y, g)
    # Vent slots along the front right.
    for i in range(11):
        slab("mvent", 0.0016, 0.004, 0.012, (W * 0.08 + i * 0.0048, face_y + 0.0016, zc - 0.006),
             bevel=0.0002, material=PORT, parent=g)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cylinder("mfoot", 0.007, 0.003, (sx * (W / 2 - 0.018), sy * (D / 2 - 0.018), 0.0015),
                     axis="z", material=RUBBER, parent=g)
    return g


def monitor(loc, rot_z):
    """
    A 24-inch business display: 3-sided thin bezel, a 17 mm chin, a housing
    that thickens in the middle, a height-adjust column with a cable hole and
    a flat plate base. Screen dark, carrying the hero's wallpaper faintly.
    """
    g = group("monitor", loc, rot_z)
    PW, PH, PD = 0.538, 0.324, 0.011
    tilt = math.radians(-5)
    panel = group("panel", (0, 0, 0.115), 0)
    panel.parent = g
    panel.rotation_euler.x = tilt
    slab("frame", PW, PD, PH, (0, 0, 0), corner=0.004, bevel=0.0012, material=SATIN, parent=panel)
    slab("chin", PW, PD + 0.001, 0.017, (0, -0.0003, 0), corner=0.004, bevel=0.0012, material=SATIN,
         parent=panel)
    # Screen as a plane just proud of the frame, with UVs for the wallpaper.
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
    uv = bm.loops.layers.uv.new("UVMap")
    for f in bm.faces:
        for lp in f.loops:
            lp[uv].uv = (lp.vert.co.x + 0.5, lp.vert.co.y + 0.5)
    me = bpy.data.meshes.new("screen")
    bm.to_mesh(me)
    bm.free()
    scr = bpy.data.objects.new("screen", me)
    bpy.context.collection.objects.link(scr)
    sw, sh = PW - 0.012, PH - 0.017 - 0.006
    scr.scale = (sw, sh, 1)
    scr.rotation_euler.x = math.radians(90)
    scr.location = (0, -PD / 2 - 0.0004, 0.017 + sh / 2)
    scr.parent = panel
    me.materials.append(glass_screen("screen", WALLPAPER, glow=0.9))
    # Rear housing.
    slab("housing", 0.42, 0.034, 0.25, (0, PD / 2 + 0.016, 0.03), corner=0.03, bevel=0.006, segments=5,
         material=SATIN, parent=panel)
    # Stand.
    slab("column", 0.07, 0.028, 0.34, (0, 0.085, 0.004), corner=0.008, bevel=0.003, material=GUNMETAL,
         parent=g)
    slab("cablehole", 0.03, 0.03, 0.03, (0, 0.085, 0.07), corner=0.012, bevel=0.002, material=PORT, parent=g)
    slab("neck", 0.06, 0.06, 0.04, (0, 0.05, 0.2), corner=0.006, bevel=0.003, material=GUNMETAL, parent=g)
    slab("base", 0.24, 0.19, 0.011, (0, 0.06, 0), corner=0.022, bevel=0.003, segments=4, material=GUNMETAL,
         parent=g)
    return g


def keyboard(loc, rot_z):
    """
    A full-size business keyboard, keys only — no legends, because a legend is
    text and the brief allows none — on a 5-degree wedge.
    """
    g = group("keyboard", loc, rot_z)
    g.rotation_euler.x = math.radians(3.5)
    U = 0.0191
    rows = [
        [1, 0.5, 1, 1, 1, 1, 0.25, 1, 1, 1, 1, 0.25, 1, 1, 1, 1],
        [1] * 13 + [2],
        [1.5] + [1] * 12 + [1.5],
        [1.75] + [1] * 11 + [2.25],
        [2.25] + [1] * 10 + [2.75],
        [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25],
    ]
    width = 15 * U + 0.5 * U + 4 * U + 0.03
    depth = 6 * U + 0.03
    slab("kb-case", width, depth, 0.011, (0, 0, 0), corner=0.006, bevel=0.0018, material=SATIN, parent=g)
    x0 = -width / 2 + 0.015
    y0 = depth / 2 - 0.015 - U / 2
    for r, row in enumerate(rows):
        x = x0
        for k, u in enumerate(row):
            if (r == 0 and u < 1):
                x += u * U
                continue
            kw = u * U - 0.0026
            slab("key", kw, U - 0.0026, 0.006, (x + u * U / 2, y0 - r * U, 0.009), corner=0.0018,
                 bevel=0.0009, segments=2, material=SOFT_TOUCH, parent=g)
            x += u * U
    # Numeric pad.
    nx = x0 + 15 * U + 0.5 * U
    for r in range(1, 6):
        for c in range(4):
            slab("npkey", U - 0.0026, U - 0.0026, 0.006,
                 (nx + c * U + U / 2, y0 - r * U, 0.009), corner=0.0018, bevel=0.0009, segments=2,
                 material=SOFT_TOUCH, parent=g)
    return g


def dock(loc, rot_z):
    """A USB-C dock: a rounded block with its ports facing the room."""
    g = group("dock", loc, rot_z)
    W, D, H = 0.13, 0.09, 0.028
    slab("dock-body", W, D, H, (0, 0, 0.002), corner=0.012, bevel=0.003, segments=4, material=GRAPHITE_DARK,
         parent=g)
    face_y = -D / 2 - 0.0002
    zc = 0.002 + H / 2
    port_usb_a("da1", -W * 0.3, zc + 0.0024, face_y, g)
    port_usb_a("da2", -W * 0.16, zc + 0.0024, face_y, g)
    port_usb_c("dc1", -W * 0.02, zc + 0.0016, face_y, g)
    jack("djk", W * 0.1, zc, face_y, g)
    cylinder("dled", 0.0012, 0.002, (W * 0.36, face_y - 0.0003, zc), material=LED_WHITE, parent=g)
    return g


def cable(points, radius=0.0022):
    cu = bpy.data.curves.new("cable", "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = radius
    cu.bevel_resolution = 4
    sp = cu.splines.new("BEZIER")
    sp.bezier_points.add(len(points) - 1)
    for bp, co in zip(sp.bezier_points, points):
        bp.co = co
        bp.handle_left_type = bp.handle_right_type = "AUTO"
    obj = bpy.data.objects.new("cable", cu)
    bpy.context.collection.objects.link(obj)
    cu.materials.append(RUBBER)
    return obj


def closed_laptop(name, loc, rot_z, parent=None):
    """
    A closed 14-inch business laptop, 32.2 x 21.8 x 1.79 cm: base and lid as
    two parts with the seam between them, the hinge barrel at the back and the
    lip at the front a thumb opens it by.
    """
    g = group(name, loc, rot_z)
    if parent:
        g.parent = parent
    W, D = 0.322, 0.218
    slab(name + "-base", W, D, 0.0105, (0, 0, 0), corner=0.009, bevel=0.0022, segments=4, material=GRAPHITE_DARK,
         parent=g)
    slab(name + "-lid", W - 0.0008, D - 0.0012, 0.0068, (0, -0.0004, 0.0112), corner=0.0088, bevel=0.0024,
         segments=4, material=GRAPHITE, parent=g)
    cylinder(name + "-hinge", 0.0046, W * 0.7, (0, D / 2 - 0.002, 0.0098), axis="x", material=SATIN, parent=g)
    slab(name + "-lip", 0.06, 0.004, 0.0028, (0, -D / 2 + 0.0008, 0.0098), corner=0.001, bevel=0.0005,
         material=PORT, parent=g)
    # Two USB-C on the left flank.
    for i in range(2):
        slab(name + "-c", 0.004, 0.0088, 0.0032, (-W / 2 - 0.0001, -0.04 + i * 0.014, 0.0038), corner=0.0014,
             bevel=0.0002, material=PORT, parent=g)
    return g


def open_laptop(name, loc, rot_z, angle=108, parent=None):
    """
    The same machine, open: a keyboard deck with its keys and touchpad, and the
    lid at about 108 degrees carrying the hero's wallpaper. On a card about a
    stack of closed laptops this is the one part that says "laptop" before the
    reader has worked out what the slabs are.
    """
    g = group(name, loc, rot_z)
    if parent:
        g.parent = parent
    W, D = 0.322, 0.218
    slab(name + "-base", W, D, 0.0105, (0, 0, 0), corner=0.009, bevel=0.0022, segments=4,
         material=GRAPHITE_DARK, parent=g)
    slab(name + "-deck", W - 0.02, D - 0.016, 0.0006, (0, -0.001, 0.0105), corner=0.007, bevel=0.0002,
         material=SATIN, parent=g)
    U = 0.0186
    x0 = -0.135
    for r, n in enumerate([15, 14, 13, 12, 11]):
        for c in range(n):
            kw = (0.27 / n) - 0.0028
            slab(name + "-k", kw, U - 0.0034, 0.0012,
                 (x0 + (c + 0.5) * 0.27 / n, 0.058 - r * U, 0.0109), corner=0.0012, bevel=0.0004, segments=2,
                 material=SOFT_TOUCH, parent=g)
    slab(name + "-space", 0.1, U - 0.0034, 0.0012, (0, 0.058 - 5 * U, 0.0109), corner=0.0012, bevel=0.0004,
         segments=2, material=SOFT_TOUCH, parent=g)
    slab(name + "-pad", 0.105, 0.062, 0.0003, (0, -0.066, 0.0108), corner=0.004, bevel=0.0001,
         material=principled("pad", "#22262c", 0.3, spec=0.5), parent=g)
    hinge = group(name + "-hinge", (0, D / 2 - 0.004, 0.0105), 0)
    hinge.parent = g
    # Upright is 90 degrees open; tilt back by the rest. Negative, because a
    # positive turn about +x swings the top of the lid towards the camera.
    hinge.rotation_euler.x = math.radians(-(angle - 90))
    slab(name + "-lid", W - 0.0008, 0.0065, D - 0.004, (0, 0.0033, 0), corner=0.0088, bevel=0.0022, segments=4,
         material=GRAPHITE, parent=hinge)
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
    uvl = bm.loops.layers.uv.new("UVMap")
    for f in bm.faces:
        for lp in f.loops:
            lp[uvl].uv = (lp.vert.co.x + 0.5, lp.vert.co.y + 0.5)
    me = bpy.data.meshes.new(name + "-screen")
    bm.to_mesh(me)
    bm.free()
    scr = bpy.data.objects.new(name + "-screen", me)
    bpy.context.collection.objects.link(scr)
    scr.scale = (W - 0.022, D - 0.03, 1)
    scr.rotation_euler.x = math.radians(90)
    # In front of the bezel, not inside it: the bezel is a full 1.2 mm plate
    # and a screen at -0.4 mm sat behind its face and never rendered.
    scr.location = (0, -0.0010, (D - 0.004) / 2 + 0.004)
    scr.parent = hinge
    me.materials.append(glass_screen(name + "-glass", WALLPAPER, glow=0.8))
    slab(name + "-bezel", W - 0.0008, 0.0012, D - 0.004, (0, -0.0001, 0), corner=0.0088, bevel=0.0003,
         material=principled("bezel-black", "#07080a", 0.4), parent=hinge)
    return g


def stack(name, loc, rot_z, n, jitter_seed=1):
    g = group(name, loc, rot_z)
    import random

    rnd = random.Random(jitter_seed)
    for i in range(n):
        closed_laptop(
            f"{name}-{i}",
            (rnd.uniform(-0.003, 0.003), rnd.uniform(-0.0025, 0.0025), i * 0.0182),
            math.radians(rnd.uniform(-0.6, 0.6)),
            parent=g,
        )
    return g


# ------------------------------------------------------------------- staging


def stage_desktops():
    # window_x: the mullion otherwise stands exactly behind the tower's right
    # edge, and two verticals touching read as one shape.
    # A touch dimmer than the rest: this camera is the lowest in the set, so
    # the window fills more of the frame than on any other card.
    room(desk_back=0.95, window_y=2.8, window_z=-0.55, window_w=5.6, window_h=3.2,
         plate_strength=WINDOW * 0.85, window_x=0.42)
    tower((-0.09, 0.07, 0), math.radians(24))
    mini_pc((0.15, -0.09, 0), math.radians(-14))
    key_light((-1.5, -0.9, 1.1), (0, 0, 0.15), 150)
    rim_light((1.3, 1.4, 0.9), (0, 0, 0.12), 180)
    ceiling(30, y=0.6)
    camera((0.32, -1.8, 0.3), (0.03, 0.0, 0.165), 80, 4.5, (0.02, -0.06, 0.12))


def stage_monitors():
    room(desk_back=1.0, window_y=3.0, window_z=-0.6, window_w=6.4, window_h=3.6, plate_strength=WINDOW)
    monitor((0.02, 0.16, 0), math.radians(16))
    keyboard((-0.04, -0.1, 0), math.radians(11))
    dock((0.33, 0.0, 0), math.radians(-6))
    # Along the desk and up the back of the column, where the stand hides it.
    # The first route rose in open air beside the column and read as a stick.
    cable([(0.33, 0.05, 0.004), (0.3, 0.2, 0.004), (0.15, 0.34, 0.004), (0.03, 0.3, 0.012),
           (-0.003, 0.266, 0.07)])
    key_light((-1.7, -1.0, 1.3), (0, 0.1, 0.25), 300)
    rim_light((1.5, 1.6, 1.1), (0, 0.1, 0.25), 220)
    camera((0.5, -1.85, 0.44), (0.04, 0.05, 0.19), 70, 5.0, (0.0, -0.02, 0.16))


def stage_fleet():
    room(desk_back=0.95, window_y=2.8, window_z=-0.55, window_w=5.6, window_h=3.2, plate_strength=WINDOW)
    s1 = stack("s1", (-0.17, -0.06, 0), math.radians(22), 4, 3)
    open_laptop("top", (0.0, 0.0, 4 * 0.0182), 0.0, angle=106, parent=s1)
    stack("s2", (0.19, 0.16, 0), math.radians(22), 6, 7)
    stack("s3", (0.52, 0.42, 0), math.radians(22), 6, 11)
    key_light((-1.5, -0.6, 1.2), (0, 0.1, 0.08), 160)
    # No rim lamp here: from this height its mirror image in the stone lands
    # beside the right-hand stack as a white smear. The window is rim enough.
    ceiling(45, y=0.9)
    camera((0.3, -1.95, 0.36), (0.12, 0.08, 0.085), 62, 5.0, (-0.16, -0.06, 0.12))


PCB = with_grain(principled("pcb", "#0f1a16", 0.42, spec=0.5, coat=0.4, coat_rough=0.25), 3000, 0.04, 0.05)
COPPER = principled("copper", "#b8734a", 0.28, metal=1.0)
ALUMINIUM = with_grain(principled("heat-spreader", "#a9b0ba", 0.3, metal=1.0, aniso=0.4), 4000, 0.02, 0.04)
CHIP = principled("chip", "#0b0c0e", 0.35, spec=0.45)
RAM_PCB = principled("ram-pcb", "#12301f", 0.4, spec=0.5, coat=0.3)
GOLD = principled("gold", "#c9a14a", 0.25, metal=1.0)


def base_plate(name, z, parent):
    """The bottom cover: the machine's own tray, feet down, vents cut in it."""
    W, D = 0.322, 0.218
    g = group(name, (0, 0, z), 0)
    g.parent = parent
    slab(name + "-tray", W, D, 0.004, (0, 0, 0), corner=0.009, bevel=0.0012, material=GRAPHITE_DARK, parent=g)
    slab(name + "-rim", W - 0.004, D - 0.004, 0.006, (0, 0, 0.003), corner=0.008, bevel=0.001,
         material=GRAPHITE_DARK, parent=g)
    slab(name + "-floor", W - 0.01, D - 0.01, 0.002, (0, 0, 0.0075), corner=0.006, bevel=0.0005,
         material=SATIN, parent=g)
    for i in range(14):
        slab(name + "-vent", 0.0026, 0.05, 0.001, (0.03 + i * 0.0062, 0.045, 0.0092), corner=0.0012,
             bevel=0.0002, material=PORT, parent=g)
    return g


def mainboard(name, z, parent):
    """
    The board, with the parts a reader can name at a glance: the processor
    under its heat spreader, the copper heat pipe to the fan, two memory
    modules, the drive, and the battery that fills the front half.
    """
    g = group(name, (0, 0, z), 0)
    g.parent = parent
    slab(name + "-pcb", 0.29, 0.1, 0.0016, (0, 0.045, 0), corner=0.004, bevel=0.0004, material=PCB, parent=g)
    slab(name + "-battery", 0.24, 0.085, 0.009, (0, -0.052, 0), corner=0.006, bevel=0.0015,
         material=SOFT_TOUCH, parent=g)
    # Processor and its spreader.
    slab(name + "-cpu", 0.028, 0.028, 0.0015, (-0.05, 0.05, 0.0016), corner=0.001, bevel=0.0003,
         material=CHIP, parent=g)
    slab(name + "-spreader", 0.036, 0.04, 0.0022, (-0.05, 0.05, 0.0031), corner=0.003, bevel=0.0006,
         material=ALUMINIUM, parent=g)
    # Heat pipe to the fan.
    cylinder(name + "-pipe", 0.0028, 0.11, (0.005, 0.05, 0.0058), axis="x", material=COPPER, parent=g)
    fan = cylinder(name + "-fan", 0.03, 0.007, (0.095, 0.05, 0.005), axis="z", material=GRAPHITE_DARK,
                   segments=64, parent=g)
    cylinder(name + "-hub", 0.009, 0.008, (0.095, 0.05, 0.0056), axis="z", material=SATIN, parent=g)
    slab(name + "-fins", 0.012, 0.05, 0.007, (0.132, 0.05, 0.0016), corner=0.001, bevel=0.0003,
         material=COPPER, parent=g)
    # Two SO-DIMMs, side by side, with their chips.
    for k in range(2):
        y = 0.02 + k * 0.034
        slab(name + f"-ram{k}", 0.068, 0.03, 0.001, (-0.105, y, 0.0022), corner=0.001, bevel=0.0002,
             material=RAM_PCB, parent=g)
        for c in range(4):
            slab(name + "-ramchip", 0.011, 0.012, 0.0012, (-0.13 + c * 0.016, y, 0.0032), bevel=0.0002,
                 material=CHIP, parent=g)
        slab(name + "-ramgold", 0.066, 0.003, 0.0004, (-0.105, y - 0.0135, 0.0033), material=GOLD, parent=g)
    # M.2 drive.
    slab(name + "-ssd", 0.06, 0.02, 0.0012, (0.02, 0.012, 0.0016), corner=0.001, bevel=0.0002,
         material=RAM_PCB, parent=g)
    slab(name + "-ssdchip", 0.024, 0.014, 0.0012, (0.012, 0.012, 0.0028), bevel=0.0002, material=CHIP, parent=g)
    # A scatter of small parts so the board reads as populated.
    import random

    rnd = random.Random(5)
    for _ in range(26):
        w = rnd.uniform(0.003, 0.009)
        slab(name + "-smd", w, w * rnd.uniform(0.6, 1.2), 0.0009,
             (rnd.uniform(-0.03, 0.12), rnd.uniform(0.005, 0.09), 0.0016), bevel=0.0002,
             material=CHIP, parent=g)
    return g


def keyboard_deck(name, z, parent):
    """The top case: palm rest, keyboard and touchpad, as one layer."""
    W, D = 0.322, 0.218
    g = group(name, (0, 0, z), 0)
    g.parent = parent
    slab(name + "-case", W, D, 0.005, (0, 0, 0), corner=0.009, bevel=0.0018, segments=4, material=GRAPHITE,
         parent=g)
    slab(name + "-well", W - 0.03, 0.118, 0.0006, (0, 0.035, 0.005), corner=0.004, bevel=0.0002,
         material=SATIN, parent=g)
    U = 0.0186
    x0 = -0.135
    for r, n in enumerate([15, 14, 13, 12, 11]):
        for c in range(n):
            kw = (0.27 / n) - 0.0028
            slab(name + "-k", kw, U - 0.0034, 0.0014, (x0 + (c + 0.5) * 0.27 / n, 0.083 - r * U, 0.0052),
                 corner=0.0012, bevel=0.0004, segments=2, material=SOFT_TOUCH, parent=g)
    slab(name + "-space", 0.1, U - 0.0034, 0.0014, (0, 0.083 - 5 * U, 0.0052), corner=0.0012, bevel=0.0004,
         segments=2, material=SOFT_TOUCH, parent=g)
    slab(name + "-pad", 0.105, 0.062, 0.0003, (0, -0.066, 0.005), corner=0.004, bevel=0.0001,
         material=principled("pad2", "#3a3f47", 0.32, metal=0.6), parent=g)
    return g


def display_layer(name, z, parent):
    """The lid, lying flat, screen up, carrying the hero's wallpaper."""
    W, D = 0.322, 0.218
    g = group(name, (0, 0, z), 0)
    g.parent = parent
    slab(name + "-lid", W, D, 0.0055, (0, 0, 0), corner=0.009, bevel=0.0018, segments=4, material=GRAPHITE,
         parent=g)
    slab(name + "-bezel", W - 0.002, D - 0.002, 0.0008, (0, 0, 0.0055), corner=0.008, bevel=0.0002,
         material=principled("bezel-b", "#07080a", 0.4), parent=g)
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
    uvl = bm.loops.layers.uv.new("UVMap")
    for f in bm.faces:
        for lp in f.loops:
            lp[uvl].uv = (lp.vert.co.x + 0.5, lp.vert.co.y + 0.5)
    me = bpy.data.meshes.new(name + "-screen")
    bm.to_mesh(me)
    bm.free()
    scr = bpy.data.objects.new(name + "-screen", me)
    bpy.context.collection.objects.link(scr)
    scr.scale = (W - 0.022, D - 0.03, 1)
    scr.location = (0, 0.002, 0.0066)
    scr.parent = g
    me.materials.append(glass_screen(name + "-glass", WALLPAPER, glow=0.9))
    return g


def stage_exploded():
    """
    "En bærbar computer skilt ad i lag: skærm, tastatur, bundkort og
    bundplade" — the four layers, in that order from the top, floating over
    the same stone desk the cards stand on, with air enough between them that
    each one reads at the 200 px the panel draws this at.
    """
    room(desk_back=0.95, window_y=2.8, window_z=-0.55, window_w=5.6, window_h=3.2, plate_strength=WINDOW)
    rig = group("exploded", (0, 0.02, 0), math.radians(-28))
    # 12 cm between layers. At 7 cm, seen from above, each layer covered the
    # one below it and the keyboard and the board were a sliver each.
    base_plate("l0", 0.04, rig)
    mainboard("l1", 0.16, rig)
    keyboard_deck("l2", 0.28, rig)
    display_layer("l3", 0.40, rig)
    key_light((-1.3, -0.7, 1.6), (0, 0, 0.22), 190)
    rim_light((1.2, 1.4, 1.1), (0, 0, 0.22), 200)
    ceiling(40, y=0.4)
    camera((0.32, -1.05, 0.78), (0.0, 0.02, 0.215), 50, 7.0, (0.0, 0.0, 0.22))


def stage_fleet_room():
    """
    "Et lokale med ens klargjorte bærbare computere stillet op på borde" — two
    benches running away from the camera towards the window, a row of the
    same machine open on each, and the lens doing what it does down a long
    room. The lower third is left dark on purpose: the panel sets a heading
    and a paragraph over it.
    """
    room(desk_back=None, window_y=3.6, window_z=-0.2, window_w=6.0, window_h=3.4, plate_strength=WINDOW * 0.75)
    stone = marble()
    for bx in (-0.34, 0.34):
        slab("bench", 0.62, 3.2, 0.035, (bx, 1.5, 0.705), bevel=0.003, segments=3, material=stone)
        for ly in (0.05, 2.95):
            for lx in (-0.26, 0.26):
                slab("leg", 0.03, 0.03, 0.705, (bx + lx, ly, 0), bevel=0.002, material=GUNMETAL)
        for i in range(6):
            open_laptop(f"fl{bx}-{i}", (bx, 0.25 + i * 0.5, 0.74), 0.0, angle=104)
    key_light((-1.4, 0.2, 2.2), (0, 1.2, 0.75), 260, size=2.0)
    ceiling(90, z=2.6, size=(2.0, 4.0), y=1.5)
    # Pitched down the benches rather than along them: level, half the frame
    # was sky, and the sky is the one part of this picture that says nothing.
    camera((0.02, -0.8, 1.22), (0.0, 1.6, 0.6), 38, 3.2, (0.0, 0.9, 0.78))


{
    "cat-desktops": stage_desktops,
    "cat-monitors": stage_monitors,
    "cat-fleet": stage_fleet,
    "exploded": stage_exploded,
    "fleet-scene": stage_fleet_room,
}[CARD]()

scene.render.filepath = OUT
bpy.ops.render.render(write_still=True)
print("wrote", OUT)
