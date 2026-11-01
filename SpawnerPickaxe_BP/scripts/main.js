import { world, system, ItemStack, GameMode } from "@minecraft/server";

const PICKAXE_ID = "internos:spawner_pickaxe";
const SPAWNER_ID = "minecraft:mob_spawner";

const MOBS = [
"minecraft:zombie", "minecraft:squelette", "minecraft:araignée",
"minecraft:cave_spider", "minecraft:blaze", "minecraft:silverfish",
"minecraft:creeper", "minecraft:enderman", "minecraft:sorcière",
"minecraft:slime", "minecraft:magma_cube", "minecraft:cochon",
"minecraft:vache", "minecraft:poulet", "minecraft:mouton",
"minecraft:husk", "minecraft:stray", "minecraft:drowned",
"minecraft:villageois_zombie", "minecraft:squelette_wither",
];

const spawnerTypes = new Map();

fonction cléDe(dimension, loc) {
renvoie `${ dimension.id }|${Math.floor(loc.x)}|${Math.floor(loc.y)}|${Math.floor(loc.z)}`;
}

monde.avantÉvénements.playerBreakBlock.subscribe((événement) => {
const { bloc, joueur, pile d'objets } = événement;
si (block.typeId !== SPAWNER_ID) retourner;
si (!itemStack || itemStack.typeId !== PICKAXE_ID) retourner;

soit mobId = null;

essayer {
const comp = block.getComponent("minecraft:mob_spawner");
si (comp) {
mobId = comp.entityTypeId ?? comp.spawnEntityId ?? comp.entityId ?? null;
}
} catch (e) {}

si (!mobId) {
essayer {
const trouvé = bloc.dimension.getEntities({
emplacement : { x : bloc.emplacement.x + 0,5, y : bloc.emplacement.y + 0,5, z : bloc.emplacement.z + 0,5 },
Distance maximale : 1,5,
exclureTypes : ["minecraft:player", "minecraft:item", "minecraft:xp_orb"],
});
pour (constante de trouvé) {
if (MOBS.includes(ent.typeId)) { mobId = ent.typeId; break; }
}
} attraper (e) {}
}

système.run(() => {
player.sendMessage(`§d[Spawner] Monstre détecté : ${mobId ?? "aucun (generique)"}`);
});

spawnerTypes.set(keyOf(block.dimension, block.location), mobId);
});

monde.aprèsÉvénements.playerBreakBlock.subscribe((événement) => {
const { joueur, permutationBlocBrisé, bloc } = événement;
si ( brokenBlockPermutation.type.id !== SPAWNER_ID) retourner;

const inventory = player.getComponent("minecraft:inventory").container;
const heldItem = inventory.getItem(player.selectedSlotIndex);
si (!heldItem || heldItem.typeId !== PICKAXE_ID) retourner;
si (player.getGameMode() === GameMode.Creative) retourner;

const clé = cléDe(bloc.dimension, bloc.emplacement);
const mobId = spawnerTypes.get(key) ?? null;
spawnerTypes.delete(clé);

const spawnerItem = new ItemStack(SPAWNER_ID, 1);
const mobName = mobId ? mobId.replace("minecraft:", "") : "générique";
spawnerItem.nameTag = `§dSpawner : ${mobName}`;
spawnerItem.setLore([
"§7Récupérer avec la Pioche Améthyste",
`§8type:${mobId ?? "none"}`,
]);

système.run(() => {
bloc.dimension.spawnItem(spawnerItem, {
x : bloc.emplacement.x + 0,5,
y : bloc.emplacement.y + 0,5,
z : bloc.emplacement.z + 0,5,
});
});
});

monde.aprèsÉvénements.blocPlaceJoueur.s'abonner((événement) => {
const { joueur, bloc } = événement;
si (block.typeId !== SPAWNER_ID) retourner;

const inventory = player.getComponent("minecraft:inventory").container;
const utilisé = inventaire.getItem(joueur.selectedSlotIndex);
const lore = used?.getLore?.() ?? [];
const ligne = lore.find((l) => l.includes("type:"));
si (!ligne) retourner;

const mobId = ligne.split("type:")[1];
si (!mobId || mobId === "aucun") retourner;

système.run(() => {
essayer {
const comp = block.getComponent("minecraft:mob_spawner");
si (comp) {
si ("entityTypeId" dans comp) comp.entityTypeId = mobId;
sinon si ("spawnEntityId" dans comp) comp.spawnEntityId = mobId;
player.sendMessage(`§d[Spawner] Restauration de monstre : ${mobId}`);
retour;
}
} attraper (e) {}

player.sendMessage("§c[Spawner] Impossible de restaurer le type automatiquement sur cette version.");
});
});
               
