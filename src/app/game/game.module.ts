import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameComponent } from './game.component';

import { GamePageRoutingModule } from './game-routing.module';

@NgModule({
    imports: [CommonModule, GamePageRoutingModule],
    declarations: [GameComponent],
})
export class GamePageModule {}
