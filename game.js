const GAME = {

    scene: null,
    camera: null,
    renderer: null,

    clock: new THREE.Clock(),

    inventory: {

        titan_drill_1: 1,
        titan_drill_2: 0,
        titan_drill_3: 0,
        titan_drill_4: 0,

        black_titan_tools: 0,

        titan_guardian_crystal: 0,
        dark_matter: 0,
        oxygen_tank: 3,
        components: 6,
        space_stone: 0,

        revive_charm: 0,

        crafting_machine: 0,
        space_gate: 0,

        titanite_blood_block: 6
    },

    selectedSlot: 0,

    hotbarItems: [
        "titan_drill_1",
        "titan_drill_2",
        "titan_drill_3",
        "titan_drill_4",
        "oxygen_tank",
        "revive_charm",
        "dark_matter",
        "components"
    ],

    reviveBuffTime: 0,
    invulnerable: false,

    sky: null,

    previewScene: null,
    previewCamera: null,
    previewRenderer: null,

    time: 0
};

function initGame() {

    GAME.scene =
        new THREE.Scene();

    /*
        Fog nhẹ hơn.
    */

    GAME.scene.fog =
        new THREE.FogExp2(
            0x7f8e9b,
            0.0012
        );

    GAME.camera =
        new THREE.PerspectiveCamera(
            70,
            innerWidth / innerHeight,
            0.1,
            600
        );

    GAME.renderer =
        new THREE.WebGLRenderer({
            antialias: false,
            powerPreference: "high-performance"
        });

    GAME.renderer.setPixelRatio(
        Math.min(
            devicePixelRatio,
            1.5
        )
    );

    GAME.renderer.setSize(
        innerWidth,
        innerHeight
    );

    GAME.renderer.shadowMap.enabled =
        true;

    GAME.renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    document
        .getElementById("game")
        .appendChild(
            GAME.renderer.domElement
        );

    createSky();

    createLights();

    PLAYER.create(
        GAME.scene
    );

    setupPreview();

    setupInput();

    setupCraftingUI();

    updateHotbar();

    animate();
}

function createSky() {

    const geometry =
        new THREE.SphereGeometry(
            500,
            24,
            16
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0x4b6175,
            side: THREE.BackSide
        });

    GAME.sky =
        new THREE.Mesh(
            geometry,
            material
        );

    GAME.scene.add(
        GAME.sky
    );
}

function createLights() {

    const ambient =
        new THREE.AmbientLight(
            0xc7d3dc,
            0.72
        );

    GAME.scene.add(
        ambient
    );

    const sun =
        new THREE.DirectionalLight(
            0xffffff,
            1.35
        );

    sun.position.set(
        100,
        180,
        80
    );

    sun.castShadow = true;

    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;

    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 500;

    GAME.scene.add(
        sun
    );
}

function setupInput() {

    window.addEventListener(
        "keydown",
        e => {

            if (e.code === "KeyW") {
                PLAYER.player.input.forward = 1;
            }

            if (e.code === "KeyS") {
                PLAYER.player.input.forward = -1;
            }

            if (e.code === "KeyA") {
                PLAYER.player.input.right = -1;
            }

            if (e.code === "KeyD") {
                PLAYER.player.input.right = 1;
            }

            if (e.code === "Space") {
                PLAYER.player.input.jump = true;
            }

            if (e.code === "KeyO") {
                PLAYER.useOxygenTank();
            }

            if (e.code === "E") {
                toggleCraftMenu();
            }

            if (e.key >= "1" && e.key <= "8") {

                const slot =
                    Number(e.key) - 1;

                selectHotbar(
                    slot
                );
            }
        }
    );

    window.addEventListener(
        "keyup",
        e => {

            if (
                e.code === "KeyW" ||
                e.code === "KeyS"
            ) {
                PLAYER.player.input.forward = 0;
            }

            if (
                e.code === "KeyA" ||
                e.code === "KeyD"
            ) {
                PLAYER.player.input.right = 0;
            }
        }
    );

    setupJoystick();

    document
        .getElementById("jump")
        .addEventListener(
            "touchstart",
            e => {

                e.preventDefault();

                PLAYER.player.input.jump =
                    true;
            },
            { passive: false }
        );
}

function setupJoystick() {

    const joystick =
        document.getElementById(
            "joystick"
        );

    const stick =
        document.getElementById(
            "stick"
        );

    let active = false;

    function move(x, y) {

        const rect =
            joystick.getBoundingClientRect();

        const centerX =
            rect.left +
            rect.width / 2;

        const centerY =
            rect.top +
            rect.height / 2;

        let dx =
            x - centerX;

        let dy =
            y - centerY;

        const max =
            38;

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (length > max) {

            dx =
                dx / length * max;

            dy =
                dy / length * max;
        }

        stick.style.transform =
            `translate(${dx}px,${dy}px)`;

        PLAYER.player.input.right =
            dx / max;

        PLAYER.player.input.forward =
            -dy / max;
    }

    joystick.addEventListener(
        "touchstart",
        e => {

            active = true;

            move(
                e.touches[0].clientX,
                e.touches[0].clientY
            );
        },
        { passive: true }
    );

    joystick.addEventListener(
        "touchmove",
        e => {

            if (!active) return;

            move(
                e.touches[0].clientX,
                e.touches[0].clientY
            );
        },
        { passive: true }
    );

    joystick.addEventListener(
        "touchend",
        () => {

            active = false;

            stick.style.transform =
                "translate(0,0)";

            PLAYER.player.input.right =
                0;

            PLAYER.player.input.forward =
                0;
        }
    );
}

function setupPreview() {

    const element =
        document.getElementById(
            "preview"
        );

    GAME.previewScene =
        new THREE.Scene();

    GAME.previewCamera =
        new THREE.PerspectiveCamera(
            45,
            1,
            0.1,
            100
        );

    GAME.previewCamera.position.set(
        2.5,
        2,
        3
    );

    GAME.previewCamera.lookAt(
        0,
        0,
        0
    );

    GAME.previewRenderer =
        new THREE.WebGLRenderer({
            alpha: true,
            antialias: false
        });

    GAME.previewRenderer.setSize(
        110,
        110
    );

    GAME.previewRenderer.setPixelRatio(1);

    element.appendChild(
        GAME.previewRenderer.domElement
    );

    GAME.previewScene.add(
        new THREE.AmbientLight(
            0xffffff,
            1
        )
    );

    updatePreview();
}

function updatePreview() {

    if (!GAME.previewScene) {
        return;
    }

    while (
        GAME.previewScene.children.length > 1
    ) {

        GAME.previewScene.remove(
            GAME.previewScene.children[1]
        );
    }

    const id =
        GAME.hotbarItems[
            GAME.selectedSlot
        ];

    const item =
        GAME_DATA.items[id];

    if (!item) return;

    /*
        Preview 3D đơn giản.
    */

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x778899
        });

    const cube =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.2,
                1.2,
                1.2
            ),
            material
        );

    GAME.previewScene.add(
        cube
    );
}

function updateHotbar() {

    const hotbar =
        document.getElementById(
            "hotbar"
        );

    hotbar.innerHTML = "";

    GAME.hotbarItems.forEach(
        (id, index) => {

            const slot =
                document.createElement(
                    "div"
                );

            slot.className =
                "slot";

            if (
                index === GAME.selectedSlot
            ) {
                slot.classList.add(
                    "selected"
                );
            }

            const icon =
                createItemIcon(id);

            slot.appendChild(
                icon
            );

            const count =
                document.createElement(
                    "span"
                );

            count.className =
                "count";

            count.textContent =
                GAME.inventory[id] || 0;

            slot.appendChild(
                count
            );

            slot.addEventListener(
                "click",
                () => {
                    selectHotbar(index);
                }
            );

            hotbar.appendChild(
                slot
            );
        }
    );
}

function createItemIcon(id) {

    return TextureSystem.createItemIcon(
        "icon_" + id,

        ctx => {

            ctx.clearRect(
                0,
                0,
                32,
                32
            );

            if (id.includes("drill")) {

                ctx.fillStyle =
                    "#555";

                ctx.fillRect(
                    13,
                    5,
                    6,
                    22
                );

                ctx.fillStyle =
                    "#aaa";

                ctx.fillRect(
                    9,
                    21,
                    14,
                    5
                );

                return;
            }

            if (id === "oxygen_tank") {

                ctx.fillStyle =
                    "#6d8490";

                ctx.fillRect(
                    10,
                    5,
                    12,
                    23
                );

                ctx.fillStyle =
                    "#c0d5dc";

                ctx.fillRect(
                    13,
                    3,
                    6,
                    4
                );

                return;
            }

            if (id === "revive_charm") {

                ctx.fillStyle =
                    "#b86cff";

                ctx.fillRect(
                    9,
                    9,
                    14,
                    14
                );

                ctx.fillStyle =
                    "#e7c8ff";

                ctx.fillRect(
                    14,
                    5,
                    4,
                    22
                );

                ctx.fillRect(
                    5,
                    14,
                    22,
                    4
                );

                return;
            }

            if (id === "dark_matter") {

                ctx.fillStyle =
                    "#090b12";

                ctx.fillRect(
                    6,
                    6,
                    20,
                    20
                );

                ctx.fillStyle =
                    "#6258a8";

                ctx.fillRect(
                    10,
                    10,
                    4,
                    4
                );

                return;
            }

            if (id === "components") {

                ctx.fillStyle =
                    "#8c969d";

                ctx.fillRect(
                    6,
                    8,
                    20,
                    5
                );

                ctx.fillRect(
                    10,
                    17,
                    15,
                    5
                );

                return;
            }

            ctx.fillStyle =
                "#777";

            ctx.fillRect(
                5,
                5,
                22,
                22
            );
        }
    );
}

function selectHotbar(index) {

    GAME.selectedSlot =
        Math.max(
            0,
            Math.min(
                GAME.hotbarItems.length - 1,
                index
            )
        );

    updateHotbar();

    updatePreview();
}

function setupCraftingUI() {

    document
        .getElementById(
            "craftButton"
        )
        .onclick =
            toggleCraftMenu;

    document
        .getElementById(
            "closeCraft"
        )
        .onclick =
            toggleCraftMenu;

    buildRecipeList();
}

function toggleCraftMenu() {

    const menu =
        document.getElementById(
            "craftMenu"
        );

    menu.style.display =
        menu.style.display === "block"
            ? "none"
            : "block";
}

function normalizeRecipe(rawRecipe) {
    if (!rawRecipe) return null;

    // mod.js dùng ingredients[]/machine, còn UI/craft dùng input/station.
    const input = {};
    (rawRecipe.ingredients || []).forEach(item => {
        if (item && item.id) input[item.id] = Number(item.count || 0);
    });

    return {
        ...rawRecipe,
        input: rawRecipe.input || input,
        station: rawRecipe.station || rawRecipe.machine || null,
        output: rawRecipe.output || { id: rawRecipe.id, count: 1 },
        name: rawRecipe.name || rawRecipe.output?.id || rawRecipe.id || "Công thức"
    };
}

function buildRecipeList() {

    const container =
        document.getElementById(
            "recipes"
        );

    container.innerHTML = "";

    Object.values(GAME_DATA.recipes || {}).forEach(
        rawRecipe => {

            const recipe = normalizeRecipe(rawRecipe);

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "recipe";

            let text =
                `<strong>${recipe.name}</strong><br>`;

            for (
                const id in recipe.input
            ) {

                const amount =
                    recipe.input[id];

                const item =
                    GAME_DATA.items[id];

                const block =
                    GAME_DATA.blocks[id];

                const name =
                    item?.name ||
                    block?.name ||
                    id;

                text +=
                    `${name} ×${amount}<br>`;
            }

            const button =
                document.createElement(
                    "button"
                );

            button.textContent =
                "Chế tạo";

            button.onclick =
                () => craft(recipe);

            div.innerHTML =
                text;

            div.appendChild(
                button
            );

            container.appendChild(
                div
            );
        }
    );
}

function canCraft(recipe) {

    for (
        const id in recipe.input
    ) {

        const required =
            recipe.input[id];

        const owned =
            GAME.inventory[id] || 0;

        if (owned < required) {
            return false;
        }
    }

    return true;
}

function craft(recipe) {

    /*
        Cổng không gian chỉ chế tạo
        tại Máy chế tạo.
    */

    if (
        recipe.station ===
        "crafting_machine"
    ) {

        if (
            GAME.inventory.crafting_machine <= 0
        ) {

            alert(
                "Cần có Máy chế tạo."
            );

            return;
        }
    }

    if (!canCraft(recipe)) {

        alert(
            "Không đủ nguyên liệu."
        );

        return;
    }

    for (
        const id in recipe.input
    ) {

        GAME.inventory[id] -=
            recipe.input[id];
    }

    const output =
        recipe.output;

    GAME.inventory[
        output.id
    ] =
        (GAME.inventory[
            output.id
        ] || 0) +
        output.count;

    updateHotbar();

    alert(
        "Đã chế tạo: " +
        GAME_DATA.blocks[
            output.id
        ].name
    );
}

function updateHUD() {

    document.getElementById(
        "health"
    ).textContent =
        `❤️ ${Math.ceil(
            PLAYER.player.health
        )} / ${PLAYER.player.maxHealth}`;

    document.getElementById(
        "oxygen"
    ).textContent =
        `🫁 O₂ ${Math.ceil(
            PLAYER.player.oxygen
        )}%`;
}

function updateOxygen(delta) {

    /*
        Có thể dùng hệ thống khu vực
        thiếu oxy sau này.
        Bản nền hiện giữ oxy ổn định
        trên bề mặt.
    */

    if (
        PLAYER.player.position.y < 12
    ) {

        PLAYER.player.oxygen -=
            delta * 1.5;

        if (
            PLAYER.player.oxygen <= 0
        ) {

            PLAYER.player.oxygen = 0;

            PLAYER.damage(
                delta * 3
            );
        }
    }
}

function updateSun() {

    GAME.time += 0.002;

    const sun =
        GAME.scene.children.find(
            object =>
                object instanceof
                THREE.DirectionalLight
        );

    if (!sun) return;

    sun.position.x =
        Math.cos(GAME.time) * 180;

    sun.position.z =
        Math.sin(GAME.time) * 180;

    sun.position.y =
        130 +
        Math.sin(GAME.time) * 50;
}

function updateCamera() {

    const p =
        PLAYER.player.position;

    GAME.camera.position.set(
        p.x,
        p.y + 3,
        p.z + 7
    );

    GAME.camera.lookAt(
        p.x,
        p.y + 1.2,
        p.z
    );
}

function animate() {

    requestAnimationFrame(
        animate
    );

    const delta =
        Math.min(
            GAME.clock.getDelta(),
            0.05
        );

    PLAYER.update(
        delta
    );

    updateCamera();

    WORLD.updateVisibleChunks(
        GAME.scene,
        PLAYER.player.position.x,
        PLAYER.player.position.z,
        4
    );

    updateOxygen(
        delta
    );

    updateSun();

    updateHUD();

    if (
        GAME.previewRenderer
    ) {

        const previewObject =
            GAME.previewScene.children[1];

        if (previewObject) {

            previewObject.rotation.y +=
                delta;
        }

        GAME.previewRenderer.render(
            GAME.previewScene,
            GAME.previewCamera
        );
    }

    GAME.renderer.render(
        GAME.scene,
        GAME.camera
    );
}

window.addEventListener(
    "resize",
    () => {

        GAME.camera.aspect =
            innerWidth / innerHeight;

        GAME.camera.updateProjectionMatrix();

        GAME.renderer.setSize(
            innerWidth,
            innerHeight
        );
    }
);

initGame();