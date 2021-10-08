import {Component, Input, OnInit} from '@angular/core';
import {Link} from '../../_entities/link.model';
import {MatDialog} from '@angular/material/dialog';
import {LinkEditDialogComponent} from './link-edit-dialog/link-edit-dialog.component';
import {LinkType} from '../../_models/link-type.enum';
import {LinkService} from '../../_services/link.service';
import {GlobalService} from '../../_services/global.service';
import {FunctionsService} from '../../_services/functions.service';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-links-panel',
  templateUrl: './links-panel.component.html',
  styleUrls: ['./links-panel.component.scss']
})
export class LinksPanelComponent implements OnInit {
  @Input() isLimited: boolean;
  links: Link[] = [];
  availableLinkTypes: string[] = [];
  nextColor: string = null;
  colors = [
    'lightpink',
    'lightcoral',
    'lightcyan',
    'lightgoldenrodyellow'
  ];

  constructor(
    private dialog: MatDialog,
    public global: GlobalService,
    private linkService: LinkService,
    private functions: FunctionsService
  ) {
  }

  private getAvailableLinkTypes(): string[] {
    let linkTypesKeys = Object.keys(this.global.linkTypes);
    linkTypesKeys = linkTypesKeys.slice(linkTypesKeys.length / 2);

    if (this.isLimited) {
      linkTypesKeys.splice(linkTypesKeys.indexOf(LinkType[LinkType.Other]), 1);
    }

    linkTypesKeys = linkTypesKeys.filter((linkTypeKey: string) => {
      return linkTypeKey === LinkType[LinkType.Other] || !this.links.find((link: Link) => link.type === linkTypeKey);
    });

    return linkTypesKeys;
  }

  private getNextColor(): string {
    for (let index = this.links.length - 1; index >= 0; --index) {
      const lastColor = this.links[index].color;
      if (!!lastColor) {
        const lastColorIndex = this.colors.indexOf(lastColor);
        if (lastColorIndex !== (-1)) {
          const nextColorIndex = (lastColorIndex + 1) % this.colors.length;
          return this.colors[nextColorIndex];
        }
      }
    }

    return this.colors[0];
  }

  getLinksListColumnsArray(): number[] {
    return this.isLimited ? [0, 0] : (this.global.isScreenSmall || this.global.isScreenMedium) ? [0, 0] : [0, 0, 0, 0, 0];
  }

  ngOnInit(): void {
    this.linkService.links.pipe(filter((links: Link[]) => !!links)).subscribe((links: Link[]) => {
      this.links = this.isLimited ? links.filter((link: Link) => link.type !== LinkType[LinkType.Other]) : links;
      this.availableLinkTypes = this.getAvailableLinkTypes();
      this.nextColor = this.getNextColor();
    });
  }

  addLink(): void {
    const data = {
      link: {} as Link,
      availableLinkTypes: this.availableLinkTypes,
      nextColor: this.nextColor
    };
    this.functions.openDialog(LinkEditDialogComponent, data);
  }

  private getAvailableLinkTypesWithCurrent(link: Link): string[] {
    if (link.type === LinkType[LinkType.Other]) {
      return this.availableLinkTypes;
    }

    const availableLinkTypes = [];

    this.availableLinkTypes.forEach((linkType: string) => availableLinkTypes.push(linkType));
    availableLinkTypes.push(link.type);

    return availableLinkTypes;
  }

  replaceLink(link: Link): void {
    const data = {
      link: {
        id: link.id,
        type: link.type,
        typeName: link.typeName,
        url: link.url,
        iconUrl: link.iconUrl,
        color: link.color
      } as Link,
      availableLinkTypes: this.getAvailableLinkTypesWithCurrent(link),
      nextColor: this.nextColor
    };
    this.functions.openDialog(LinkEditDialogComponent, data);
  }

  deleteLink(link: Link): void {
    this.linkService.deleteLink(link).subscribe();
  }
}
