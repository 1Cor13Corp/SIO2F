import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-conforme',
  templateUrl: './no-conforme.component.html',
  styleUrls: ['./no-conforme.component.scss']
})
export class NoConformeComponent {

  @Input() conformidad:any;

}
