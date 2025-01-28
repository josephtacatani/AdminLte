import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DentalHistory } from 'src/app/interfaces/dental_history.interface';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private isModalVisibleSubject = new BehaviorSubject<boolean>(false);
  private modalTitleSubject = new BehaviorSubject<string>('Add Dental History'); // ✅ Fix: Add modal title
  private selectedDentalHistorySubject = new BehaviorSubject<DentalHistory | null>(null);

  isModalVisible$ = this.isModalVisibleSubject.asObservable();
  modalTitle$ = this.modalTitleSubject.asObservable(); // ✅ Fix: Expose modal title as observable
  selectedDentalHistory$ = this.selectedDentalHistorySubject.asObservable();

  /**
   * ✅ Opens the modal with a specified title and selected data.
   */
  openModal(title: string, dentalHistory?: DentalHistory): void {
    this.modalTitleSubject.next(title); // ✅ Fix: Set the modal title
    this.selectedDentalHistorySubject.next(dentalHistory || null);
    this.isModalVisibleSubject.next(true);
  }

  /**
   * ✅ Closes the modal and resets selected data.
   */
  closeModal(): void {
    this.isModalVisibleSubject.next(false);
    this.modalTitleSubject.next('Add Dental History'); // ✅ Reset title when closing
    this.selectedDentalHistorySubject.next(null);
  }
}
