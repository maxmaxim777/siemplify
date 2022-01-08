import {
  ChangeDetectorRef,
  Component,
  EmbeddedViewRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {FormControl} from "@angular/forms";
import {debounceTime, filter, fromEvent, takeUntil} from "rxjs";
import {UntilDestroy, untilDestroyed} from '@ngneat/until-destroy';
import Popper from 'popper.js';
import {Menu} from "../../interfaces/menu";

@UntilDestroy()
@Component({
  selector: 'general-select',
  templateUrl: './general-select.component.html',
  styleUrls: ['./general-select.component.scss']
})
export class GeneralSelectComponent implements OnInit {

  @Input() options: Menu[] = [];
  @Input() chosen: Menu;
  @Input() optionTemplate: TemplateRef<any>;
  @Input() headerTemplate: TemplateRef<any>;

  @Input() color: any = 'primary';
  @Input() size: any = 'small';
  @Input() shape: any = 'rectangle';

  @Output() selectedValue = new EventEmitter();
  @Output() selectedOption = new EventEmitter();
  @Output() closed = new EventEmitter()

  searchControl = new FormControl();

  private originalOptions: any[] = [];
  private popperRef: Popper;
  private view: EmbeddedViewRef<any>;

  constructor(private vcr: ViewContainerRef, private zone: NgZone, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.originalOptions = [...this.options];

    if (this.chosen !== undefined) {
      const foundItem = this.options.find(
        currentOption => currentOption.id === this.chosen.id
      );
      if (foundItem) {
        this.chosen = foundItem;
      }
    }

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        untilDestroyed(this)
      )
      .subscribe(term => this.search(term));
  }


  get isOpen() {
    return !!this.popperRef;
  }

  get label() {
    return this.chosen && this.chosen.id !== -1 ? this.chosen.label : 'Select...';
  }


  search(value: string) {
    this.options = this.originalOptions.filter(
      option => option.label.includes(value)
    );
  }

  select(option: Menu) {
    this.chosen = option;
    this.selectedValue.emit(option.label);
    this.selectedOption.emit(option);
  }

  isActive(option: any) {
    if (!this.chosen) {
      return false;
    }

    return option.id === this.chosen.id;
  }


  open(menuTpl: TemplateRef<any>, origin: HTMLElement) {
    this.view = this.vcr.createEmbeddedView(menuTpl);
    const dropdown = this.view.rootNodes[0];

    document.body.appendChild(dropdown);
    dropdown.style.width = `${origin.offsetWidth}px`;

    this.zone.runOutsideAngular(() => {
      this.popperRef = new Popper(origin, dropdown, {
        removeOnDestroy: true
      });
    });

    this.handleClickOutside();
  }

  close() {
    this.closed.emit();
    this.popperRef.destroy();
    this.view.destroy();
    this.searchControl.patchValue('');
    // @ts-ignore
    this.view = null;
    // @ts-ignore
    this.popperRef = null;
  }

  private handleClickOutside() {
    fromEvent(document, 'click')
      .pipe(
        filter(({ target }) => {
          const origin = this.popperRef.reference as HTMLElement;
          return origin.contains(target as HTMLElement) === false;
        }),
        takeUntil(this.closed)
      )
      .subscribe(() => {
        this.close();
        this.cdr.detectChanges();
      });
  }

  reset() {
    this.chosen = {id: -1, label: ''};
    this.selectedValue.emit();
    this.selectedOption.emit();
  }

  calculateClasses() {
    return `${this.color} ${this.size} ${this.shape}`;
  }
}
