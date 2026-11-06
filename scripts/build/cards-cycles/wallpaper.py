"""
The screen wallpaper: a navy field with the hero laptop's blue light ribbon.

    python wallpaper.py <out.png>

Drawn rather than cut from the hero plate, because the hero's screen is
seen at an angle and a crop of it would carry the perspective. Same idea at
a fraction of its brightness: the renders show it on a monitor, an open
laptop and an exploded lid, and each glows at under a unit so the screen is
the one blue thing in the room without being a light source in it.
"""
import bpy, numpy as np, sys
W,H=1600,1000
y,x=np.mgrid[0:H,0:W].astype(np.float32)
u=x/W; v=1-y/H
base=np.stack([0.004+0.01*v,0.006+0.012*v,0.02+0.035*v],-1)
img=base.copy()
def ribbon(center, amp, freq, phase, width, tint, gain):
    cy=center+amp*np.sin(2*np.pi*(freq*u)+phase)+0.18*(u-0.5)**2
    d=(v-cy)
    core=np.exp(-(d/width)**2)
    glow=np.exp(-(d/(width*6))**2)*0.35
    fade=np.clip((u-0.12)/0.35,0,1)*np.clip((1.05-u)/0.4,0,1)
    return (core+glow)[...,None]*np.array(tint)[None,None,:]*gain*fade[...,None]
img+=ribbon(0.42,0.12,0.9,0.6,0.012,[0.20,0.38,1.0],1.3)
img+=ribbon(0.38,0.10,0.9,0.9,0.03,[0.06,0.14,0.55],0.9)
img+=ribbon(0.47,0.08,0.8,0.2,0.006,[0.55,0.7,1.0],0.5)
img=np.clip(img,0,1)
im=bpy.data.images.new("wp",W,H,float_buffer=False)
im.colorspace_settings.name='sRGB'
# convert linear-ish values to sRGB bytes approx
rgba=np.concatenate([img**(1/2.2),np.ones((H,W,1),np.float32)],-1)[::-1].ravel()
im.pixels.foreach_set(rgba)
im.filepath_raw=sys.argv[-1]; im.file_format='PNG'; im.save()
print("ok")
