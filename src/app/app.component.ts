import {Component} from '@angular/core';
import {Menu} from "./shared/interfaces/menu";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'siemplify';

  menu: Menu[] = [
    {id: 1, label: 'max'},
    {id: 2, label: 'david'},
    {id: 3, label: 'liron'},
    {id: 4, label: 'noa'}

  ];

  public selectedItem: any;
  public selectedValue: string = '';


  onSelectedItem(item: Menu) {
    this.selectedItem = item;
  }

  onSelectedValue(item: string) {
    this.selectedValue = item;
  }


}
