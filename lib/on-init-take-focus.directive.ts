// Framework-agnostic html element attribute directive.
// To use, create a subclass for use in the specific framework you want.
// Example (for use in Angular):
/******
@Directive({selector: 'appOnInitTakeFocus'})
export class AppOnInitTakeFocusDirective extends OnInitTakeFocusDirective
 implements OnInit, OnDestroy {
   @Input() delayReturningFocus;

   constructor(elRef: ElementRef){
      super(elRef.nativeElement);
   }

   ngOnInit(){
      this.onInit();
   }

   ngOnDestroy(){
      this.onDestroy(this.delayReturningFocus);
   }
}
******/

export class OnInitTakeFocusDirective {
   //
   private __returnFocusOnDestroy = true;
   private __previouslyFocusedElementId: string;
   private readonly __temporaryId: string = "app-temporary-id-" + Math.random();

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

   onDestroy(
      delayReturningFocus = 0 // ms
   ) {
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
      }, delayReturningFocus);
   }
}
