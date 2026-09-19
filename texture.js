"use strict";

const TEXTURE_SIZE = 32;

const TextureSystem = (() => {
    const cache = {};

    function hash(x, y, seed = 0) {
        let n = Math.imul(x + seed * 31, 374761393);
        n = Math.imul(n ^ (n >>> 13), 668265263);
        n ^= Math.imul(y + seed * 17, 1442695041);
        n = Math.imul(n ^ (n >>> 16), 1274126177);
        return ((n ^ (n >>> 15)) >>> 0) / 4294967295;
    }

    function hexToRgb(hex) {
        const value = parseInt(String(hex).replace("#", ""), 16);
        return {
            r: (value >> 16) & 255,
            g: (value >> 8) & 255,
            b: value & 255
        };
    }

    function rgb(r, g, b, a = 1) {
        return `rgba(${Math.max(0, Math.min(255, r))},${Math.max(0, Math.min(255, g))},${Math.max(0, Math.min(255, b))},${a})`;
    }

    function mix(a, b, amount) {
        return {
            r: a.r + (b.r - a.r) * amount,
            g: a.g + (b.g - a.g) * amount,
            b: a.b + (b.b - a.b) * amount
        };
    }

    function createTexture(id, base, accent) {
        if (cache[id]) return cache[id];

        const canvas = document.createElement("canvas");
        canvas.width = TEXTURE_SIZE;
        canvas.height = TEXTURE_SIZE;

        const ctx = canvas.getContext("2d", { alpha: false });
        const baseRGB = hexToRgb(base);
        const accentRGB = hexToRgb(accent);
        const darkRGB = mix(baseRGB, { r: 0, g: 0, b: 0 }, 0.28);
        const lightRGB = mix(baseRGB, { r: 255, g: 255, b: 255 }, 0.12);
        const seed = id.length * 97;

        // Nền có biến thiên nhẹ thay vì một màu phẳng.
        for (let y = 0; y < 32; y++) {
            for (let x = 0; x < 32; x++) {
                const n = hash(x, y, seed);
                const shade = (n - 0.5) * 0.10;
                const c = shade >= 0
                    ? mix(baseRGB, lightRGB, shade / 0.08)
                    : mix(darkRGB, baseRGB, (shade + 0.08) / 0.08);
                ctx.fillStyle = rgb(c.r, c.g, c.b);
                ctx.fillRect(x, y, 1, 1);
            }
        }

        // Các hạt khoáng nhỏ có kích thước/độ sáng khác nhau.
        for (let i = 0; i < 55; i++) {
            const x = Math.floor(hash(i, 7, seed) * 32);
            const y = Math.floor(hash(i, 19, seed + 3) * 32);
            const n = hash(i, 29, seed + 9);

            if (n > 0.38) {
                const size = n > 0.88 ? 2 : 1;
                const alpha = n > 0.72 ? 0.75 : 0.45;
                ctx.fillStyle = rgb(
                    accentRGB.r,
                    accentRGB.g,
                    accentRGB.b,
                    alpha
                );
                ctx.fillRect(x, y, size, size);
            }
        }

        // Một vài vệt khoáng dạng pixel để bề mặt có chiều sâu hơn.
        for (let i = 0; i < 7; i++) {
            let x = Math.floor(hash(i, 41, seed) * 28) + 2;
            let y = Math.floor(hash(i, 53, seed) * 28) + 2;
            const length = 2 + Math.floor(hash(i, 67, seed) * 5);

            ctx.fillStyle = rgb(
                accentRGB.r,
                accentRGB.g,
                accentRGB.b,
                0.28
            );

            for (let p = 0; p < length; p++) {
                ctx.fillRect(x + p, y + ((p + i) % 2), 1, 1);
            }
        }

        // Pixel nứt rất nhẹ, tránh làm texture quá rối.
        if (id !== "titanite_eternal") {
            ctx.fillStyle = rgb(0, 0, 0, 0.18);
            for (let i = 0; i < 3; i++) {
                let x = 3 + Math.floor(hash(i, 83, seed) * 24);
                let y = 2 + Math.floor(hash(i, 97, seed) * 25);
                const length = 3 + Math.floor(hash(i, 101, seed) * 4);
                for (let p = 0; p < length; p++) {
                    ctx.fillRect(x + p, y + (p % 2), 1, 1);
                }
            }
        }

        // Viền pixel cực nhẹ giúp mặt block rõ ở khoảng cách xa.
        ctx.fillStyle = rgb(0, 0, 0, 0.12);
        ctx.fillRect(0, 0, 32, 1);
        ctx.fillRect(0, 31, 32, 1);
        ctx.fillRect(0, 0, 1, 32);
        ctx.fillRect(31, 0, 1, 32);

        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.generateMipmaps = false;
        texture.anisotropy = 1;
        texture.needsUpdate = true;

        cache[id] = texture;
        return texture;
    }

    function createItemIcon(id, drawFunction) {
        if (cache[id]) return cache[id];

        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;

        const ctx = canvas.getContext("2d");
        drawFunction(ctx);

        cache[id] = canvas;
        return canvas;
    }

    return {
        createTexture,
        createItemIcon
    };
})();
