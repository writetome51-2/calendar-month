export class OnInitTakeFocusDirective {

   constructor(private host: HTMLElement) {
   }

   onInit() {
      this.host.focus();
   }

   onDestroy() {
   }
}
