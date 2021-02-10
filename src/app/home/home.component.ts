import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    template: ` <a [routerLink]="['/game']">game</a> `,
    styles: [],
})
export class HomeComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}
