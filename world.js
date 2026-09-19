const WORLD = (() => {

    const CHUNK_SIZE = 32;
    const WORLD_HEIGHT = 64;

    const chunks = new Map();

    const blockTypes = {
        0: null,
        1: "titanite",
        2: "titanite_black",
        3: "titanite_blood",
        4: "titanite_igneous",
        5: "titanite_eternal",
        6: "titan_vault",
        7: "crafting_machine",
        8: "space_gate"
    };

    const blockIDs = {
        air: 0,
        titanite: 1,
        titanite_black: 2,
        titanite_blood: 3,
        titanite_igneous: 4,
        titanite_eternal: 5,
        titan_vault: 6,
        crafting_machine: 7,
        space_gate: 8
    };

    function chunkKey(cx, cz) {
        return `${cx},${cz}`;
    }

    function worldToChunk(x, z) {

        return {
            cx: Math.floor(x / CHUNK_SIZE),
            cz: Math.floor(z / CHUNK_SIZE)
        };
    }

    function localCoord(value) {

        let result = value % CHUNK_SIZE;

        if (result < 0) {
            result += CHUNK_SIZE;
        }

        return result;
    }

    function getTerrainHeight(x, z) {

        const h =
            20 +
            Math.sin(x * 0.045) * 4 +
            Math.cos(z * 0.035) * 4 +
            Math.sin((x + z) * 0.018) * 5;

        return Math.max(8, Math.floor(h));
    }

    function getBlockByY(y) {

        if (y >= 64) {
            return 0;
        }

        /*
            Layer 1:
            Titanite

            Layer 2:
            Titanite Đen

            Layer 3:
            Titanite Huyết

            Layer 4:
            Titanite Nham

            Layer 5:
            Titanite Vĩnh Hằng
        */

        if (y <= 1) {
            return blockIDs.titanite_eternal;
        }

        if (y <= 7) {
            return blockIDs.titanite_igneous;
        }

        if (y <= 15) {
            return blockIDs.titanite_blood;
        }

        if (y <= 23) {
            return blockIDs.titanite_black;
        }

        return blockIDs.titanite;
    }

    function noise3(x, y, z) {

        const n =
            Math.sin(x * 12.9898 +
                     y * 78.233 +
                     z * 37.719) *
            43758.5453;

        return n - Math.floor(n);
    }

    function generateChunk(cx, cz) {

        const key = chunkKey(cx, cz);

        if (chunks.has(key)) {
            return chunks.get(key);
        }

        const data =
            new Uint8Array(
                CHUNK_SIZE *
                WORLD_HEIGHT *
                CHUNK_SIZE
            );

        function index(x, y, z) {

            return (
                x +
                CHUNK_SIZE *
                (z + CHUNK_SIZE * y)
            );
        }

        for (let x = 0; x < CHUNK_SIZE; x++) {

            for (let z = 0; z < CHUNK_SIZE; z++) {

                const wx = cx * CHUNK_SIZE + x;
                const wz = cz * CHUNK_SIZE + z;

                const surface =
                    getTerrainHeight(wx, wz);

                for (let y = 0; y < WORLD_HEIGHT; y++) {

                    if (y > surface) {
                        data[index(x, y, z)] = 0;
                        continue;
                    }

                    let block = getBlockByY(y);

                    /*
                        Simple caves.
                    */

                    if (
                        y > 3 &&
                        y < surface - 2 &&
                        noise3(wx, y, wz) > 0.84
                    ) {
                        block = 0;
                    }

                    data[index(x, y, z)] = block;
                }
            }
        }

        const chunk = {
            cx,
            cz,
            data,
            mesh: null
        };

        chunks.set(key, chunk);

        return chunk;
    }

    function getBlock(x, y, z) {

        if (
            y < 0 ||
            y >= WORLD_HEIGHT
        ) {
            return 0;
        }

        const c = worldToChunk(x, z);

        const chunk =
            generateChunk(c.cx, c.cz);

        const lx = localCoord(x);
        const lz = localCoord(z);

        const index =
            lx +
            CHUNK_SIZE *
            (lz + CHUNK_SIZE * y);

        return chunk.data[index];
    }

    function isSolid(x, y, z) {

        return getBlock(x, y, z) !== 0;
    }

    /*
        Chỉ tạo mặt nếu mặt đó không bị
        block khác che.
    */

    const FACE_DIRS = [
        { x: 1,  y: 0,  z: 0 },
        { x: -1, y: 0,  z: 0 },
        { x: 0,  y: 1,  z: 0 },
        { x: 0,  y: -1, z: 0 },
        { x: 0,  y: 0,  z: 1 },
        { x: 0,  y: 0, z: -1 }
    ];

    const FACE_VERTICES = [

        [
            [0.5,-0.5,-0.5],
            [0.5, 0.5,-0.5],
            [0.5, 0.5, 0.5],
            [0.5,-0.5, 0.5]
        ],

        [
            [-0.5,-0.5, 0.5],
            [-0.5, 0.5, 0.5],
            [-0.5, 0.5,-0.5],
            [-0.5,-0.5,-0.5]
        ],

        [
            [-0.5,0.5, 0.5],
            [0.5,0.5, 0.5],
            [0.5,0.5,-0.5],
            [-0.5,0.5,-0.5]
        ],

        [
            [-0.5,-0.5,-0.5],
            [0.5,-0.5,-0.5],
            [0.5,-0.5,0.5],
            [-0.5,-0.5,0.5]
        ],

        [
            [0.5,-0.5,0.5],
            [0.5,0.5,0.5],
            [-0.5,0.5,0.5],
            [-0.5,-0.5,0.5]
        ],

        [
            [-0.5,-0.5,-0.5],
            [-0.5,0.5,-0.5],
            [0.5,0.5,-0.5],
            [0.5,-0.5,-0.5]
        ]
    ];

    function createChunkMesh(cx, cz) {

        const chunk = generateChunk(cx, cz);
        if (chunk.mesh) return chunk.mesh;

        const positions = [];
        const normals = [];
        const uvs = [];

        // Một atlas duy nhất: tránh hàng nghìn draw-call do material/group.
        const textureIDs = [
            ["titanite", "#6f7b86", "#a6b2bd"],
            ["titanite_black", "#39414a", "#68727c"],
            ["titanite_blood", "#6a3e43", "#b85a60"],
            ["titanite_igneous", "#5a3930", "#d66a3f"],
            ["titanite_eternal", "#252d36", "#657382"]
        ];

        const atlasCanvas = document.createElement("canvas");
        atlasCanvas.width = 32;
        atlasCanvas.height = 32 * textureIDs.length;
        const atlasCtx = atlasCanvas.getContext("2d", { alpha: false });

        textureIDs.forEach((entry, i) => {
            const tex = TextureSystem.createTexture(entry[0], entry[1], entry[2]);
            atlasCtx.drawImage(tex.image, 0, i * 32);
        });

        const atlas = new THREE.CanvasTexture(atlasCanvas);
        atlas.magFilter = THREE.NearestFilter;
        atlas.minFilter = THREE.NearestFilter;
        atlas.generateMipmaps = false;
        atlas.anisotropy = 1;
        atlas.needsUpdate = true;

        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let z = 0; z < CHUNK_SIZE; z++) {
                for (let y = 0; y < WORLD_HEIGHT; y++) {
                    const block = chunk.data[x + CHUNK_SIZE * (z + CHUNK_SIZE * y)];
                    if (block === 0) continue;

                    for (let face = 0; face < 6; face++) {
                        const dir = FACE_DIRS[face];
                        const wx = cx * CHUNK_SIZE + x;
                        const wz = cz * CHUNK_SIZE + z;

                        if (isSolid(wx + dir.x, y + dir.y, wz + dir.z)) continue;

                        const vertices = FACE_VERTICES[face];
                        for (let i = 0; i < 4; i++) {
                            positions.push(
                                wx + vertices[i][0],
                                y + vertices[i][1],
                                wz + vertices[i][2]
                            );
                            normals.push(dir.x, dir.y, dir.z);
                        }

                        const atlasIndex = Math.max(0, Math.min(4, block - 1));
                        const vTop = 1 - atlasIndex / textureIDs.length;
                        const vBottom = 1 - (atlasIndex + 1) / textureIDs.length;
                        uvs.push(0, vBottom, 1, vBottom, 1, vTop, 0, vTop);
                    }
                }
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

        // DoubleSide tránh mất tam giác do winding trên mobile/WebGL khác nhau.
        const material = new THREE.MeshStandardMaterial({
            map: atlas,
            color: 0xffffff,
            roughness: 0.92,
            metalness: 0,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = true;
        chunk.mesh = mesh;
        return mesh;
    }

    function unloadChunk(cx, cz) {

        const key = chunkKey(cx, cz);

        const chunk = chunks.get(key);

        if (!chunk) {
            return;
        }

        if (chunk.mesh) {

            chunk.mesh.geometry.dispose();

            if (Array.isArray(chunk.mesh.material)) {
                chunk.mesh.material.forEach(m => m.dispose());
            } else {
                chunk.mesh.material.dispose();
            }
        }

        chunks.delete(key);
    }

    function updateVisibleChunks(
        scene,
        playerX,
        playerZ,
        renderDistance = 4
    ) {

        const center =
            worldToChunk(
                Math.floor(playerX),
                Math.floor(playerZ)
            );

        const wanted = new Set();

        for (
            let dx = -renderDistance;
            dx <= renderDistance;
            dx++
        ) {

            for (
                let dz = -renderDistance;
                dz <= renderDistance;
                dz++
            ) {

                /*
                    Hình tròn chunk thay vì
                    tải một hình vuông quá lớn.
                */

                if (
                    dx * dx +
                    dz * dz >
                    renderDistance * renderDistance
                ) {
                    continue;
                }

                const cx =
                    center.cx + dx;

                const cz =
                    center.cz + dz;

                const key =
                    chunkKey(cx, cz);

                wanted.add(key);

                const chunk =
                    generateChunk(cx, cz);

                if (!chunk.mesh) {

                    const mesh =
                        createChunkMesh(
                            cx,
                            cz
                        );

                    scene.add(mesh);
                }
            }
        }

        for (const [key, chunk] of chunks) {

            if (!wanted.has(key)) {

                if (chunk.mesh) {
                    scene.remove(chunk.mesh);
                }

                unloadChunk(
                    chunk.cx,
                    chunk.cz
                );
            }
        }
    }

    function getSpawnHeight(x, z) {
        // Player position is the center of a 2-block-tall character.
        return getTerrainHeight(x, z) + 0.5;
    }

    return {
        CHUNK_SIZE,
        WORLD_HEIGHT,
        getTerrainHeight,
        getSpawnHeight,
        getBlock,
        isSolid,
        generateChunk,
        createChunkMesh,
        updateVisibleChunks,
        unloadChunk
    };

})();