import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit,OnDestroy{
  @Input() modalID = ''
  
  constructor(public modal: ModalService, public element: ElementRef) { }

  ngOnDestroy(): void {
    document.body.removeChild(this.element.nativeElement);
  }
  
  ngOnInit() {
    document.body.appendChild(this.element.nativeElement);
  }

  closeModal() {
    this.modal.toggleModal(this.modalID);
  }


}
