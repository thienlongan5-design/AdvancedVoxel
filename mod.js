/* =========================================================
   mod.js
   DỮ LIỆU GAME + HỆ THỐNG MOD
   Game voxel nguyên bản
   ========================================================= */

"use strict";

/* =========================================================
   GAME DATA
   ========================================================= */

const GAME_DATA = {

    /* =====================================================
       BLOCKS
       ===================================================== */

    blocks: {

        titanite: {
            id: "titanite",
            name: "Titanite",
            layer: 1,
            hardness: 1.0,
            solid: true,
            mineLevel: 1
        },

        titanite_black: {
            id: "titanite_black",
            name: "Titanite Đen",
            layer: 2,
            hardness: 2.0,
            solid: true,
            mineLevel: 2
        },

        titanite_blood: {
            id: "titanite_blood",
            name: "Titanite Huyết",
            layer: 3,
            hardness: 3.0,
            solid: true,
            mineLevel: 3
        },

        titanite_igneous: {
            id: "titanite_igneous",
            name: "Titanite Nham",
            layer: 4,
            hardness: 3.0,
            solid: true,
            mineLevel: 4
        },

        titanite_eternal: {
            id: "titanite_eternal",
            name: "Titanite Vĩnh Hằng",
            layer: 5,
            hardness: Infinity,
            solid: true,
            mineLevel: Infinity,
            unbreakable: true
        },

        dark_matter_ore: {
            id: "dark_matter_ore",
            name: "Quặng Vật Chất Tối",
            layer: 1,
            hardness: 1.5,
            solid: true,
            mineLevel: 1,
            ore: true
        },

        titan_vault: {
            id: "titan_vault",
            name: "Titan Vault",
            hardness: 4.0,
            solid: true,
            storage: true,
            original: true
        },

        crafting_machine: {
            id: "crafting_machine",
            name: "Máy chế tạo",
            hardness: 3.0,
            solid: true,
            craftingMachine: true
        },

        space_gate: {
            id: "space_gate",
            name: "Cổng không gian",
            hardness: 5.0,
            solid: true,
            portal: true
        }
    },


    /* =====================================================
       ITEMS
       ===================================================== */

    items: {

        /* ---------- DRILLS ---------- */

        titan_drill_1: {
            id: "titan_drill_1",
            name: "Titan Drill I",
            type: "tool",
            toolType: "drill",
            miningLevel: 1,
            durability: 250,
            maxStack: 1
        },

        titan_drill_2: {
            id: "titan_drill_2",
            name: "Titan Drill II",
            type: "tool",
            toolType: "drill",
            miningLevel: 2,
            durability: 500,
            maxStack: 1
        },

        titan_drill_3: {
            id: "titan_drill_3",
            name: "Titan Drill III",
            type: "tool",
            toolType: "drill",
            miningLevel: 3,
            durability: 750,
            maxStack: 1
        },

        titan_drill_4: {
            id: "titan_drill_4",
            name: "Titan Drill IV",
            type: "tool",
            toolType: "drill",
            miningLevel: 4,
            durability: 1000,
            maxStack: 1
        },


        /* ---------- TITANITE BLACK TOOLS ---------- */

        black_titanite_tool: {
            id: "black_titanite_tool",
            name: "Công cụ Titanite Đen",
            type: "tool",
            material: "titanite_black",
            miningLevel: 2,
            durability: 600,
            maxStack: 1
        },


        /* ---------- MATERIALS ---------- */

        dark_matter: {
            id: "dark_matter",
            name: "Vật Chất Tối",
            type: "material",
            maxStack: 64
        },

        titan_guard_crystal: {
            id: "titan_guard_crystal",
            name: "Tinh thể Hộ vệ Titan",
            type: "material",
            maxStack: 64
        },

        component: {
            id: "component",
            name: "Linh kiện",
            type: "material",
            maxStack: 64
        },

        space_stone: {
            id: "space_stone",
            name: "Viên đá không gian",
            type: "material",
            maxStack: 64
        },


        /* ---------- BLOCK ITEMS ---------- */

        titanite_blood: {
            id: "titanite_blood",
            name: "Khối Titanite Huyết",
            type: "block",
            blockId: "titanite_blood",
            maxStack: 64
        },

        titan_vault: {
            id: "titan_vault",
            name: "Titan Vault",
            type: "block",
            blockId: "titan_vault",
            maxStack: 64
        },

        crafting_machine: {
            id: "crafting_machine",
            name: "Máy chế tạo",
            type: "block",
            blockId: "crafting_machine",
            maxStack: 64
        },

        space_gate: {
            id: "space_gate",
            name: "Cổng không gian",
            type: "block",
            blockId: "space_gate",
            maxStack: 64
        },


        /* ---------- CONSUMABLES ---------- */

        oxygen_tank: {
            id: "oxygen_tank",
            name: "Bình oxy",
            type: "consumable",
            maxStack: 16,

            effect: {
                type: "oxygen",
                amountPercent: 30
            }
        },


        /* ---------- REVIVE CHARM ---------- */

        revive_charm: {
            id: "revive_charm",
            name: "Bùa thế mạng",
            type: "passive",
            maxStack: 16,

            effect: {
                type: "revive",

                restoreHealth: true,

                restoreHealthToMax: true,

                fireImmunity: true,

                defense: true,

                healing: true,

                immuneToOneAttack: true
            }
        }
    },


    /* =====================================================
       TITAN VAULT LOOT
       ===================================================== */

    vaultLoot: [

        {
            id: "titan_drill_1",
            name: "Titan Drill I",
            chance: 10
        },

        {
            id: "titan_drill_2",
            name: "Titan Drill II",
            chance: 6
        },

        {
            id: "titan_drill_3",
            name: "Titan Drill III",
            chance: 5
        },

        {
            id: "titan_drill_4",
            name: "Titan Drill IV",
            chance: 4
        },

        {
            id: "black_titanite_tool",
            name: "Công cụ Titanite Đen",
            chance: 7
        },

        {
            id: "titan_guard_crystal",
            name: "Tinh thể Hộ vệ Titan",
            chance: 2
        },

        {
            id: "dark_matter",
            name: "Vật Chất Tối",
            chance: 25
        },

        {
            id: "oxygen_tank",
            name: "Bình oxy",
            chance: 30
        },

        {
            id: "component",
            name: "Linh kiện",
            chance: 10
        },

        {
            id: "space_stone",
            name: "Viên đá không gian",
            chance: 0.5
        },

        {
            id: "revive_charm",
            name: "Bùa thế mạng",
            chance: 0.5
        }
    ],


    /* =====================================================
       CRAFTING RECIPES
       ===================================================== */

    recipes: {

        /* ---------------------------------------------
           MÁY CHẾ TẠO
           6 Linh kiện -> 1 Máy chế tạo
           --------------------------------------------- */

        crafting_machine: {
            id: "crafting_machine",

            type: "inventory_crafting",

            ingredients: [
                {
                    id: "component",
                    count: 6
                }
            ],

            output: {
                id: "crafting_machine",
                count: 1
            }
        },


        /* ---------------------------------------------
           CỔNG KHÔNG GIAN
           4 Vật Chất Tối
           1 Viên đá không gian
           6 Khối Titanite Huyết
           --------------------------------------------- */

        space_gate: {
            id: "space_gate",

            type: "machine",

            machine: "crafting_machine",

            ingredients: [
                {
                    id: "dark_matter",
                    count: 4
                },

                {
                    id: "space_stone",
                    count: 1
                },

                {
                    id: "titanite_blood",
                    count: 6
                }
            ],

            output: {
                id: "space_gate",
                count: 1
            }
        }
    }
};


/* =========================================================
   VALIDATE LOOT TABLE
   ========================================================= */

function validateTitanVaultLoot() {

    let total = 0;

    for (const loot of GAME_DATA.vaultLoot) {

        if (
            !loot ||
            typeof loot.chance !== "number" ||
            loot.chance < 0
        ) {
            console.error(
                "Titan Vault: loot không hợp lệ:",
                loot
            );

            continue;
        }

        if (!GAME_DATA.items[loot.id]) {

            console.error(
                "Titan Vault: item không tồn tại:",
                loot.id
            );

            continue;
        }

        total += loot.chance;
    }

    const valid =
        Math.abs(total - 100) < 0.000001;

    if (!valid) {

        console.warn(
            "Titan Vault loot đang không đủ 100%. Tổng:",
            total + "%"
        );
    }

    return valid;
}


/* =========================================================
   RANDOM TITAN VAULT LOOT
   ========================================================= */

function rollTitanVaultLoot() {

    const roll = Math.random() * 100;

    let current = 0;

    for (const loot of GAME_DATA.vaultLoot) {

        current += loot.chance;

        if (roll < current) {

            const item =
                GAME_DATA.items[loot.id];

            if (!item) {
                return null;
            }

            return {

                id: loot.id,

                name: item.name,

                count: 1
            };
        }
    }

    return null;
}


/* =========================================================
   ROLL NHIỀU ITEM
   Có thể dùng sau này nếu Titan Vault có nhiều ô loot.
   ========================================================= */

function rollTitanVaultLootMultiple(count = 1) {

    const results = [];

    count = Math.max(
        1,
        Math.floor(count)
    );

    for (let i = 0; i < count; i++) {

        const loot =
            rollTitanVaultLoot();

        if (loot) {
            results.push(loot);
        }
    }

    return results;
}


/* =========================================================
   INVENTORY HELPERS
   ========================================================= */

function getItemData(id) {

    return GAME_DATA.items[id] || null;
}


function getBlockData(id) {

    return GAME_DATA.blocks[id] || null;
}


function getMaxStack(id) {

    const item =
        getItemData(id);

    if (!item) {
        return 64;
    }

    return item.maxStack || 64;
}


/* =========================================================
   INVENTORY COUNT
   ========================================================= */

function getInventoryItemCount(id) {

    if (
        typeof GAME === "undefined" ||
        !GAME.inventory
    ) {
        return 0;
    }

    return GAME.inventory[id] || 0;
}


/* =========================================================
   ADD ITEM
   ========================================================= */

function addItemToInventory(id, count = 1) {

    if (
        typeof GAME === "undefined" ||
        !GAME.inventory
    ) {
        return false;
    }

    const item =
        getItemData(id);

    if (!item) {
        console.warn(
            "Không thể thêm item không tồn tại:",
            id
        );

        return false;
    }

    count =
        Math.max(
            0,
            Math.floor(count)
        );

    if (count <= 0) {
        return false;
    }

    if (!GAME.inventory[id]) {
        GAME.inventory[id] = 0;
    }

    GAME.inventory[id] += count;

    return true;
}


/* =========================================================
   REMOVE ITEM
   ========================================================= */

function removeItemFromInventory(id, count = 1) {

    if (
        typeof GAME === "undefined" ||
        !GAME.inventory
    ) {
        return false;
    }

    count =
        Math.max(
            0,
            Math.floor(count)
        );

    if (
        !GAME.inventory[id] ||
        GAME.inventory[id] < count
    ) {
        return false;
    }

    GAME.inventory[id] -= count;

    if (GAME.inventory[id] <= 0) {
        delete GAME.inventory[id];
    }

    return true;
}


/* =========================================================
   CHECK INGREDIENTS
   ========================================================= */

function hasRecipeIngredients(recipe) {

    if (
        typeof GAME === "undefined" ||
        !GAME.inventory
    ) {
        return false;
    }

    if (!recipe || !recipe.ingredients) {
        return false;
    }

    for (const ingredient of recipe.ingredients) {

        const amount =
            GAME.inventory[ingredient.id] || 0;

        if (amount < ingredient.count) {
            return false;
        }
    }

    return true;
}


/* =========================================================
   CRAFT RECIPE
   ========================================================= */

function craftRecipe(recipeId) {

    if (
        typeof GAME === "undefined" ||
        !GAME.inventory
    ) {
        return {
            success: false,
            reason: "inventory_unavailable"
        };
    }

    const recipe =
        GAME_DATA.recipes[recipeId];

    if (!recipe) {

        return {
            success: false,
            reason: "recipe_not_found"
        };
    }

    if (!hasRecipeIngredients(recipe)) {

        return {
            success: false,
            reason: "missing_ingredients"
        };
    }


    /* ---------------------------------------------
       Trừ nguyên liệu
       --------------------------------------------- */

    for (const ingredient of recipe.ingredients) {

        removeItemFromInventory(
            ingredient.id,
            ingredient.count
        );
    }


    /* ---------------------------------------------
       Thêm kết quả
       --------------------------------------------- */

    addItemToInventory(
        recipe.output.id,
        recipe.output.count
    );


    /* ---------------------------------------------
       Thông báo cho UI
       --------------------------------------------- */

    if (
        typeof updateInventoryUI === "function"
    ) {
        updateInventoryUI();
    }


    return {

        success: true,

        output: {
            id: recipe.output.id,
            count: recipe.output.count
        }
    };
}


/* =========================================================
   CRAFT TRONG MÁY CHẾ TẠO
   ========================================================= */

function craftInMachine(recipeId) {

    const recipe =
        GAME_DATA.recipes[recipeId];

    if (!recipe) {

        return {
            success: false,
            reason: "recipe_not_found"
        };
    }

    if (recipe.type !== "machine") {

        return {
            success: false,
            reason: "requires_machine"
        };
    }

    return craftRecipe(recipeId);
}


/* =========================================================
   USE OXYGEN TANK
   ========================================================= */

function useOxygenTank() {

    if (
        typeof PLAYER === "undefined" ||
        !PLAYER.player
    ) {
        return false;
    }

    if (
        getInventoryItemCount("oxygen_tank") <= 0
    ) {
        return false;
    }

    const player =
        PLAYER.player;

    const maxOxygen =
        player.maxOxygen || 100;

    const amount =
        maxOxygen * 0.30;

    player.oxygen =
        Math.min(
            maxOxygen,
            (player.oxygen || 0) + amount
        );

    removeItemFromInventory(
        "oxygen_tank",
        1
    );


    if (
        typeof updateOxygenUI === "function"
    ) {
        updateOxygenUI();
    }


    if (
        typeof updateInventoryUI === "function"
    ) {
        updateInventoryUI();
    }

    return true;
}


/* =========================================================
   BÙA THẾ MẠNG
   Không cần cầm trên tay.
   ========================================================= */

function hasReviveCharm() {

    return (
        getInventoryItemCount(
            "revive_charm"
        ) > 0
    );
}


/* =========================================================
   KÍCH HOẠT BÙA THẾ MẠNG
   ========================================================= */

function activateReviveCharm() {

    if (
        typeof PLAYER === "undefined" ||
        !PLAYER.player
    ) {
        return false;
    }

    if (!hasReviveCharm()) {
        return false;
    }

    const player =
        PLAYER.player;


    /* ---------------------------------------------
       Tiêu hao 1 Bùa
       --------------------------------------------- */

    const removed =
        removeItemFromInventory(
            "revive_charm",
            1
        );

    if (!removed) {
        return false;
    }


    /* ---------------------------------------------
       Hồi máu tối đa
       --------------------------------------------- */

    if (
        typeof player.maxHealth === "number"
    ) {
        player.health =
            player.maxHealth;
    }
    else {
        player.health = player.maxHealth || 60;
    }


    /* ---------------------------------------------
       Chống lửa
       --------------------------------------------- */

    player.fireImmune = true;

    player.fireImmunityTimer = 5000;


    /* ---------------------------------------------
       Hiệu ứng phòng thủ
       --------------------------------------------- */

    player.defenseActive = true;

    player.defenseTimer = 5000;


    /* ---------------------------------------------
       Hiệu ứng hồi máu
       --------------------------------------------- */

    player.healingActive = true;

    player.healingTimer = 5000;


    /* ---------------------------------------------
       Miễn nhiễm 1 đòn
       --------------------------------------------- */

    player.immuneToOneAttack = true;


    /* ---------------------------------------------
       Đặt trạng thái sống lại
       --------------------------------------------- */

    player.dead = false;

    player.canMove = true;


    /* ---------------------------------------------
       Cập nhật UI
       --------------------------------------------- */

    if (
        typeof updateInventoryUI === "function"
    ) {
        updateInventoryUI();
    }

    if (
        typeof updateHealthUI === "function"
    ) {
        updateHealthUI();
    }


    return true;
}


/* =========================================================
   XỬ LÝ KHI PLAYER SẮP MẤT MỘT MẠNG
   ========================================================= */

function tryRevivePlayer() {

    if (
        typeof PLAYER === "undefined" ||
        !PLAYER.player
    ) {
        return false;
    }

    if (!hasReviveCharm()) {
        return false;
    }

    return activateReviveCharm();
}


/* =========================================================
   KIỂM TRA DRILL CÓ PHÁ ĐƯỢC BLOCK KHÔNG
   ========================================================= */

function canMineBlock(toolId, blockId) {

    const tool =
        getItemData(toolId);

    const block =
        getBlockData(blockId);

    if (!block) {
        return false;
    }


    /* Titanite Vĩnh Hằng */

    if (block.unbreakable) {
        return false;
    }


    /* Không có công cụ */

    if (!tool) {
        return false;
    }


    /* Công cụ phải là drill */

    if (
        tool.toolType !== "drill" &&
        tool.type !== "tool"
    ) {
        return false;
    }


    const miningLevel =
        tool.miningLevel || 0;


    return miningLevel >=
        (block.mineLevel || 1);
}


/* =========================================================
   TITAN VAULT SPAWN SETTINGS
   ========================================================= */

const TITAN_VAULT_SETTINGS = {

    enabled: true,

    /* Tần suất spawn.
       Có thể điều chỉnh sau khi test thế giới. */

    spawnChance: 0.0015,

    minDistance: 32,

    avoidBottomLayer: true,

    avoidVoid: true,

    onlyValidTerrain: true
};


/* =========================================================
   KIỂM TRA VỊ TRÍ TITAN VAULT
   ========================================================= */

function canSpawnTitanVault(
    blockId,
    y
) {

    const block =
        getBlockData(blockId);

    if (!block) {
        return false;
    }

    /* Không spawn trong Titanite Vĩnh Hằng */

    if (
        block.id === "titanite_eternal"
    ) {
        return false;
    }

    /* Không spawn dưới thế giới */

    if (y < 0) {
        return false;
    }

    return true;
}


/* =========================================================
   TẠO LOOT CHO TITAN VAULT
   ========================================================= */

function generateTitanVaultLoot() {

    const loot =
        rollTitanVaultLoot();

    if (!loot) {
        return [];
    }

    return [loot];
}


/* =========================================================
   MỞ TITAN VAULT
   ========================================================= */

function openTitanVault() {

    const loot =
        generateTitanVaultLoot();

    return {
        opened: true,
        loot: loot
    };
}


/* =========================================================
   EXPORT DỮ LIỆU TOÀN CỤC
   ========================================================= */

if (typeof window !== "undefined") {

    window.GAME_DATA =
        GAME_DATA;

    window.TITAN_VAULT_SETTINGS =
        TITAN_VAULT_SETTINGS;

    window.rollTitanVaultLoot =
        rollTitanVaultLoot;

    window.rollTitanVaultLootMultiple =
        rollTitanVaultLootMultiple;

    window.getItemData =
        getItemData;

    window.getBlockData =
        getBlockData;

    window.getMaxStack =
        getMaxStack;

    window.getInventoryItemCount =
        getInventoryItemCount;

    window.addItemToInventory =
        addItemToInventory;

    window.removeItemFromInventory =
        removeItemFromInventory;

    window.hasRecipeIngredients =
        hasRecipeIngredients;

    window.craftRecipe =
        craftRecipe;

    window.craftInMachine =
        craftInMachine;

    window.useOxygenTank =
        useOxygenTank;

    window.hasReviveCharm =
        hasReviveCharm;

    window.activateReviveCharm =
        activateReviveCharm;

    window.tryRevivePlayer =
        tryRevivePlayer;

    window.canMineBlock =
        canMineBlock;

    window.canSpawnTitanVault =
        canSpawnTitanVault;

    window.generateTitanVaultLoot =
        generateTitanVaultLoot;

    window.openTitanVault =
        openTitanVault;

    window.validateTitanVaultLoot =
        validateTitanVaultLoot;
}


/* =========================================================
   KIỂM TRA KHI LOAD FILE
   ========================================================= */

validateTitanVaultLoot();

console.log(
    "mod.js đã được tải.",
    GAME_DATA
);