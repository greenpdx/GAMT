import { Component, OnInit } from '@angular/core';

import { AuthorComponent } from '../authors/author.component';

@Component({
    selector: 'authors',
    template: `
        <div>
            <author [authorInfo]="shawn"></author>
            <author [authorInfo]="richard"></author>
            <author [authorInfo]="shaun"></author>
        </div>
    `,
    styles: []
})

export class AuthorsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  shaun = "Shaun Savage";
  shawn = "Shawn Miller";
  richard = "Richard Colvin";

}
