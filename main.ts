import { startSimpleKit, SKContainer, Layout, setSKRoot } from "./simplekit/src/imperative-mode";
import { Model } from "./src/model";
import { Controller } from "./src/controller";
import { MainView } from "./src/MainView";
import { MemberDetailView } from "./src/MemberDetailView";
import { Color, Size} from "./src/constants";

// initialize the MVC architecture
const model = new Model();
const controller = new Controller(model);

// Create root container with centered layout
const root = new SKContainer({width: Size.PANEL_WIDTH, height: Size.PANEL_HEIGHT});
root.layoutMethod = new Layout.CentredLayout();
root.fill = Color.BACKGROUND;

// create an app container to manage navigation between views
class AppContainer extends SKContainer {
  private currentView: SKContainer | null = null;

  constructor() {
    super();
    this.showMainView();
  }

  private clearView(): void {
    if (this.currentView) {
      this.removeChild(this.currentView);
    }
  }

  public showMainView(): void {
    this.clearView();
    this.currentView = new MainView(model, controller, {
      onViewMember: (memberId: string) => this.showMemberDetailView(memberId)
    });
    this.addChild(this.currentView);
  }

  public showMemberDetailView(memberId: string): void {
    this.clearView();
    this.currentView = new MemberDetailView(model, controller, memberId, () => this.showMainView());
    this.addChild(this.currentView);
  }
}

// the app container and start SimpleKit
const app = new AppContainer();
root.addChild(app);
setSKRoot(root);
startSimpleKit();