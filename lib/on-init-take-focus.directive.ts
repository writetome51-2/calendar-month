export class OnInitTakeFocusDirective {
   //
   private __returnFocusOnDestroy = true;
   private __previouslyFocusedElementId: string;
   private readonly __temporaryId: string = "app-temporary-id-" + Math.random();

   // input
   delayReturningFocus = 0; // ms

   constructor(private __host: HTMLElement) {}

   onInit() {
      if (!document.activeElement.id) {
         document.activeElement.setAttribute("id", this.__temporaryId);
      }
      this.__previouslyFocusedElementId = document.activeElement.id;

      // If user blurs element before it's destroyed, we don't return focus
      this.__host.onblur = () => (this.__returnFocusOnDestroy = false);
      this.__host.focus();
   }

   onDestroy() {
      setTimeout(() => {
         const previouslyFocusedElement = document.getElementById(
            this.__previouslyFocusedElementId
         );
         if (!!previouslyFocusedElement) {
            if (this.__returnFocusOnDestroy) {
               previouslyFocusedElement.focus();
            }
            if (this.__previouslyFocusedElementId === this.__temporaryId) {
               previouslyFocusedElement.removeAttribute("id");
            }
         }
      }, this.delayReturningFocus);
   }
}
