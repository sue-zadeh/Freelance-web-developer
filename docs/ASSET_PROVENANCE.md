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


## Café architectural textures — 4 November 2026

These generated photographic textures replace the illustrated café surfaces while retaining separate CSS 3D floor, wall, furniture and plant planes. They are a concept, not images of a client's actual café. The six crops were extracted from one 1536 × 1024 atlas and encoded as WebP; no objects were painted or semantically edited in code. The original alpha channel is retained.

Creation mode: built-in image generation.

| Final asset | Dimensions | Bytes |
| --- | --- | --- |
| `public/images/cafe-floor.webp` | 512 × 512 | 57,316 |
| `public/images/cafe-back-wall.webp` | 512 × 254 | 20,320 |
| `public/images/cafe-window-wall.webp` | 512 × 257 | 29,096 |
| `public/images/cafe-table.webp` | 384 × 384 | 36,304 |
| `public/images/cafe-plant.webp` | 256 × 256 | 26,182 |
| `public/images/cafe-counter.webp` | 512 × 220 | 25,934 |

Total: 195,152 bytes. Repeated furniture uses the same files. All texture images use native lazy loading and explicit dimensions.

### Generation prompt

Use case: product-mockup. Asset type: photoreal architectural texture and furniture atlas for an interactive 3D boutique cafe, NOT a finished isometric room. Create ONE landscape 3:2 image arranged as a precisely regular invisible grid of THREE columns by TWO rows, six equal square cells, ideally 1536 by 1024 pixels. Truly transparent alpha outside each isolated object. No cell labels, borders or gaps between cells except transparent gutters. Every object entirely inside its own cell. Coordinated premium cafe palette: natural honey oak, muted deep sage plaster, pale limestone, black steel, warm brass, fresh green leaves. Meticulous REAL architecture/interior and product photography with believable material grain and natural texture, no illustration or cartoon. Read cells left to right, top to bottom: (1) a square swatch of richly textured warm oak herringbone floor, directly overhead orthographic, fills almost the entire square cell with no perspective, no furnishings, uniform lighting; (2) a straight-on elevation of a beautiful cafe BACK WALL, a clean WIDE horizontal rectangle exactly 2:1, centred in its square cell with transparent area above and below. Muted deep sage plaster with warm vertical oak joinery and restrained brass sconces, small shelves with pottery and coffee details. No floor, ceiling, counter, people, readable text, or perspective. Flat front-on architectural elevation only; (3) a straight-on elevation of a matching SIDE WALL, also a WIDE 2:1 horizontal rectangle centred in its square cell, pale textured lime plaster and two tall black-framed windows showing softly blurred sunlit courtyard greenery, realistic window reflections, no floor or ceiling and no perspective; (4) isolated ROUND walnut cafe dining tabletop viewed EXACTLY overhead, two small white plates, two cappuccino cups and restrained cutlery, beautiful grain and food photography detail, transparent outside its round edge, no legs, no chairs, no cast shadow on a surface; (5) one lush potted indoor plant viewed EXACTLY overhead, photoreal dense varied green leaves and a small terracotta pot, isolated transparent silhouette, no floor or background; (6) a rectangular cafe counter worktop viewed EXACTLY overhead, WIDE 3:1 horizontal rectangle centred in its square cell, pale ivory stone with subtle veins, a small realistic espresso machine, two cups and a pastry tray, transparent outside its rectangular edge, no legs or background. Consistent natural soft light, photographic realism, every plane orthographic to its own surface so the textures can be assembled on separate CSS 3D planes. No whole room, no isometric views, no logos, no text, no people, no watermark.
