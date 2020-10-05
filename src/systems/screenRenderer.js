import { System } from "ecsy";
import { Enemy, Location, Path, Phaser, Tile, Sprite } from "../components";
import translateToScreen from "../Utils/translateToScreen";

export default class GridRenderSystem extends System {
  execute() {
    const game = this.queries.phaser.results[0].getComponent(Phaser).game;
    const activeScene = game.scene.scenes.filter((s) =>
      game.scene.isVisible(s.scene.key)
    )[0];

    // Add things to the active scene outside the switch to add to all scenes.
    activeScene.add.image(500, 500, "brownRock");

    // Add UI elements to particular scenes
    activeScene.add.text(700, 700, activeScene.scene.key);
    switch (activeScene.scene.key) {
      case "menu":
        break;
      case "prep":
      //  break;
      case "play":
        const activeEnemies = this.queries.enemies.results;
        activeEnemies.forEach((ent) => {
          const enemyLocation = ent.getComponent(Location);

          const screenCords = translateToScreen(enemyLocation.x,enemyLocation.y)
          if (ent.getMutableComponent(Sprite)) {
            const spriteToUpdate = ent.getMutableComponent(Sprite);
            spriteToUpdate.sprite.x = screenCords.x;
            spriteToUpdate.sprite.y = screenCords.y;
          } else {
            const enemySprite = activeScene.add.image(
                screenCords.x,
                screenCords.y,
              "badRock"
            );
            enemySprite.scaleX = 0.1;
            enemySprite.scaleY = 0.1;
            enemySprite.depth = 1;
            ent.addComponent(Sprite, { sprite: enemySprite });
          }
        });

        const tileResults = this.queries.tiles.results;
        //activeScene.add.text(700,700,"play")
        tileResults.forEach((ent) => {
          const tile = ent.getComponent(Tile);
          // add text at tile.x, tile.y except project coordinates of tiles to coordinates of canvas
          const screenCords = translateToScreen(tile.x,tile.y)
          const sprite = activeScene.add.image(
            screenCords.x,
            screenCords.y,
            tile.isOccupied ? "greenRock" : "brownRock"
          );
          sprite.setInteractive().setData("coords", [tile.x, tile.y]);
          sprite.scaleX = 0.1;
          sprite.scaleY = 0.1;
        });
        break;
      default:
        activeScene.add.text(700, 700, "bad scene");
        break;
    }
  }
}

GridRenderSystem.queries = {
  phaser: { components: [Phaser] },
  tiles: { components: [Tile], listen: { added: true, modified: true } },
  enemies: { components: [Enemy, Path, Location] },
  sprite: { components: [Sprite] },
};
