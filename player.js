"use strict";

const PLAYER = (() => {

    const player = {
        object: null,
        position: new THREE.Vector3(16, 30, 16),
        velocity: new THREE.Vector3(),
        yaw: 0,
        pitch: -0.22,
        speed: 5,
        jumpPower: 7,
        health: 60,
        maxHealth: 60,
        oxygen: 100,
        maxOxygen: 100,
        grounded: false,
        drillLevel: 1,
        input: { forward: 0, right: 0, jump: false },
        modelBottomOffset: 0,
        modelReady: false,
        mixer: null,
        actions: {},
        currentAction: null
    };

    // Căn chân của mọi model về cùng một mốc player.position.y.
    // Nhờ vậy fallback và player.glb không bị lệch/lún khi đổi model.
    function fitModelToPlayer(object, targetHeight = 2) {
        if (!object) return;

        const before = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        before.getSize(size);

        if (size.y > 0.001) {
            const scale = targetHeight / size.y;
            object.scale.multiplyScalar(scale);
        }

        object.updateMatrixWorld(true);

        const box = new THREE.Box3().setFromObject(object);
        player.modelBottomOffset = box.min.y - object.position.y;
    }

    function setupObject(object, scene, isFallback = false) {
        player.object = object;

        // Cả fallback và GLB đều được chuẩn hóa về cùng chiều cao 2 block.
        fitModelToPlayer(object, 2.0);

        object.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.frustumCulled = true;
            }
        });

        scene.add(object);
        player.modelReady = true;
    }

    function create(scene) {
        // Hiển thị fallback ngay lập tức để không có khoảng trống khi GLB đang tải.
        const fallback = ModelLoader.fallbackCube(
            new THREE.MeshStandardMaterial({
                color: 0xeeeeee,
                roughness: 0.8,
                metalness: 0.05
            })
        );
        setupObject(fallback, scene, true);

        // ModelLoader hiện không có hasGLTF(); cứ tải trực tiếp và dùng fallback nếu lỗi.
        ModelLoader.load(
            "./player.glb",
            (object, animations) => {
                if (!object) return;

                if (player.object) {
                    scene.remove(player.object);
                }

                setupObject(object, scene, false);
            },
            error => {
                console.warn("Không tải được player.glb, giữ fallback.", error);
            }
        );
    }

    function update(delta) {
        const moving =
            Math.abs(player.input.forward) +
            Math.abs(player.input.right) > 0.05;

        // Cùng hệ tọa độ với camera: yaw=0 nhìn về -Z.
        const forwardX = Math.sin(player.yaw);
        const forwardZ = -Math.cos(player.yaw);
        const rightX = Math.cos(player.yaw);
        const rightZ = Math.sin(player.yaw);

        let dx =
            forwardX * player.input.forward +
            rightX * player.input.right;

        let dz =
            forwardZ * player.input.forward +
            rightZ * player.input.right;

        const len = Math.hypot(dx, dz);
        if (len > 1) {
            dx /= len;
            dz /= len;
        }

        player.velocity.x = dx * player.speed;
        player.velocity.z = dz * player.speed;
        player.velocity.y -= 18 * delta;

        if (player.input.jump && player.grounded) {
            player.velocity.y = player.jumpPower;
            player.grounded = false;
        }

        player.position.x += player.velocity.x * delta;
        player.position.y += player.velocity.y * delta;
        player.position.z += player.velocity.z * delta;

        // Player position = chân nhân vật. Block được đặt tại tâm ô,
        // nên mặt trên của block y là y + 0.5.
        const HALF = 0.30;
        const HEIGHT = 2.0;

        function overlapsXZ(bx, bz, px, pz) {
            return Math.abs(px - bx) < 0.5 + HALF - 0.001 &&
                   Math.abs(pz - bz) < 0.5 + HALF - 0.001;
        }

        function collidesBody(px, py, pz) {
            const minX = Math.floor(px - HALF + 0.5);
            const maxX = Math.floor(px + HALF + 0.5);
            const minZ = Math.floor(pz - HALF + 0.5);
            const maxZ = Math.floor(pz + HALF + 0.5);
            const minY = Math.floor(py + 0.001 + 0.5);
            const maxY = Math.floor(py + HEIGHT - 0.001 + 0.5);

            for (let bx = minX; bx <= maxX; bx++) {
                for (let bz = minZ; bz <= maxZ; bz++) {
                    if (!overlapsXZ(bx, bz, px, pz)) continue;
                    for (let by = minY; by <= maxY; by++) {
                        if (WORLD.isSolid(bx, by, bz)) return true;
                    }
                }
            }
            return false;
        }

        // Va chạm ngang: giải quyết X và Z riêng để không xuyên góc block.
        const oldX = player.position.x;
        const oldZ = player.position.z;

        if (collidesBody(player.position.x, player.position.y, player.position.z)) {
            player.position.x = oldX;
            player.position.z = oldZ;
        }

        // Va chạm nền/mặt block dưới chân.
        const prevY = player.position.y - player.velocity.y * delta;
        if (player.velocity.y <= 0) {
            const probeY = player.position.y - 0.06;
            const bx0 = Math.floor(player.position.x - HALF + 0.5);
            const bx1 = Math.floor(player.position.x + HALF + 0.5);
            const bz0 = Math.floor(player.position.z - HALF + 0.5);
            const bz1 = Math.floor(player.position.z + HALF + 0.5);
            let bestTop = -Infinity;

            for (let bx = bx0; bx <= bx1; bx++) {
                for (let bz = bz0; bz <= bz1; bz++) {
                    if (!overlapsXZ(bx, bz, player.position.x, player.position.z)) continue;
                    const by = Math.floor(probeY + 0.5);
                    if (WORLD.isSolid(bx, by, bz)) {
                        bestTop = Math.max(bestTop, by + 0.5);
                    }
                }
            }

            if (bestTop > -Infinity && player.position.y <= bestTop + 0.08 && prevY >= bestTop - 0.12) {
                player.position.y = bestTop;
                player.velocity.y = 0;
                player.grounded = true;
            } else {
                player.grounded = false;
            }
        } else {
            player.grounded = false;
        }

        if (player.object) {
            player.object.position.x = player.position.x;
            player.object.position.y =
                player.position.y - player.modelBottomOffset;
            player.object.position.z = player.position.z;

            const facingYaw = moving
                ? Math.atan2(dx, dz)
                : player.yaw;

            player.object.rotation.y = facingYaw + Math.PI;
            player.object.userData.facingYaw = facingYaw;
        }

        if (player.mixer) {
            player.mixer.update(delta);
            const next = moving ? (player.actions.walk || player.actions.idle) : player.actions.idle;
            if (next && next !== player.currentAction) {
                if (player.currentAction) player.currentAction.fadeOut(0.12);
                next.reset().fadeIn(0.12).play();
                player.currentAction = next;
            }
        }

        player.input.jump = false;
    }

    function damage(amount) {
        if (GAME.invulnerable) return;

        player.health -= amount;

        if (player.health <= 0) {
            if (GAME.inventory && GAME.inventory.revive_charm > 0) {
                GAME.inventory.revive_charm--;
                player.health = player.maxHealth;
                GAME.invulnerable = true;
                setTimeout(() => GAME.invulnerable = false, 1000);
                return;
            }

            player.health = player.maxHealth;
            player.position.set(
                16,
                WORLD.getTerrainHeight(16, 16) + 0.5,
                16
            );
        }
    }

    function useOxygenTank() {
        if (!GAME.inventory || GAME.inventory.oxygen_tank <= 0) return;

        GAME.inventory.oxygen_tank--;
        player.oxygen = Math.min(
            player.maxOxygen,
            player.oxygen + player.maxOxygen * 0.30
        );
    }

    return {
        player,
        create,
        update,
        damage,
        useOxygenTank
    };
})();
