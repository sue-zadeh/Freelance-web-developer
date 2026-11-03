# Sandwich asset provenance

The website uses a generated photographic ingredient atlas, not a photograph of a client's actual meal. The six cutouts retain CSS 3D rotation and animated assembly.

- Final asset: `public/images/sandwich-ingredients.webp`
- Dimensions: 1200 × 800, with transparency.
- Size: 267,258 bytes.
- Creation mode: built-in image generation. The generated 1536 × 1024 PNG was encoded as a smaller WebP for the website; food content was not painted or retouched in code.
- Atlas layout: three equal columns and two equal rows; each final cell is 400 × 400.

| Cell | Ingredient |
| --- | --- |
| Row 1, column 1 | Toasted sourdough base |
| Row 1, column 2 | Lettuce |
| Row 1, column 3 | Tomato slices |
| Row 2, column 1 | Cheddar |
| Row 2, column 2 | Cucumber |
| Row 2, column 3 | Toasted sourdough top |

## Generation prompt

Use case: product-mockup. Asset type: photographic texture atlas for an interactive sandwich assembled in CSS 3D. Create ONE wide 3:2 image with a genuinely transparent alpha background, arranged as an invisible, perfectly regular grid of THREE columns by TWO rows. Six separate food cutouts, each centred inside its own equal square cell, each entirely contained within the middle 80% of that cell with generous transparent gutters. Read cells left to right, top to bottom: (1) a single rustic sourdough sandwich bread slice with rich golden toasted crust and detailed open crumb, (2) a broad loosely folded cluster of fresh green lettuce leaves, (3) a small overlapping cluster of three juicy red tomato slices with real seeds and moisture, (4) one thin square slice of mature cheddar cheese with naturally irregular edges and fine pores, (5) a small overlapping cluster of four fresh cucumber rounds with translucent seeds and dark green rind, (6) another matching golden toasted sourdough bread slice, naturally different from the first. Style: meticulous REAL FOOD STUDIO PHOTOGRAPHY, appetising premium restaurant product photography, natural variations and fine tactile details, no illustration, no cartoon, no plastic or smooth CGI. Camera: all six subjects photographed orthographically from DIRECTLY overhead, zero perspective, same scale and rotation, soft light from upper left. Each ingredient group has approximately the same footprint so these cutouts can stack to make one sandwich. Only food cutouts; no plate, no utensils, no background surface, no border, no grid lines, no labels, no text, no visible cast shadow on a background, no watermark. Output composition must be three equally sized columns and two equally sized rows, ideally 1536 by 1024 pixels, real transparency around each cutout.

