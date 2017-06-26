import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'author',
    template: `
        <p>
            {{authorInfo}}
        </p>
    `,
    styles: []
})

export class AuthorComponent implements OnInit {
    @Input() authorInfo: any;

    constructor() { }

    ngOnInit() {
    }

}
