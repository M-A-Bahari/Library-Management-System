// tab based main view with header, tabs, sub-views
import {SKContainer, SKLabel, SKButton, Layout} from "../simplekit/src/imperative-mode";
import { Subscriber } from "./subscriber";
import { Controller } from "./controller";
import { Model } from "./model";
import { Color, Size } from "./constants";
import { BookListView } from "./BookListView";
import { AdminView } from "./AdminView";

export class MainView extends SKContainer implements Subscriber {
  private model: Model;
  private controller: Controller;
  private contentContainer!: SKContainer;
  private currentTab: "members" | "books" | "admin" = "members";
  private onViewMember?: (memberId: string) => void;

  private membersTabBtn!: SKButton;
  private booksTabBtn!: SKButton;
  private adminTabBtn!: SKButton;

  private bookListView!: BookListView;
  private adminView!: AdminView;

  constructor(model: Model, controller: Controller, callbacks?: { onViewMember?: (memberId: string) => void }) {
    super();
    this.width = Size.PANEL_WIDTH;
    this.height = Size.PANEL_HEIGHT;
    this.model = model;
    this.controller = controller;
    this.onViewMember = callbacks?.onViewMember;
    this.layoutMethod = new Layout.WrapRowLayout({});
    this.fill = Color.MAINPANEL;
    this.border = "black";

    // create sub-views
    this.bookListView = new BookListView(model, controller);
    this.adminView = new AdminView(model, controller);

    this.buildUI();
    this.model.addSubscriber(this);
  }

  private buildUI(): void {
    // header
    const header = new SKLabel({text: "Library Management System", width: Size.PANEL_WIDTH, height: Size.HEADER_HEIGHT, align: "centre"});
    header.font = "bold 35px Times New Roman";
    header.fill = Color.HEADER_COLOR;
    this.addChild(header);

    // tab bar
    const tabBar = new SKContainer({width: Size.PANEL_WIDTH, height: Size.TAB_HEIGHT});
    tabBar.layoutMethod = new Layout.FillRowLayout({});
    tabBar.fill = Color.TAB_OFF;

    this.membersTabBtn = new SKButton({ text: "Members", width: Size.TAB_WIDTH, height: Size.TAB_HEIGHT });
    this.membersTabBtn.font = "bold 25px Times New Roman";
    this.membersTabBtn.fill = Color.TAB_ON;
    this.membersTabBtn.addEventListener("action", () => this.switchTab("members"));

    this.booksTabBtn = new SKButton({ text: "Books", width: Size.TAB_WIDTH, height: Size.TAB_HEIGHT });
    this.booksTabBtn.font = "bold 25px Times New Roman";
    this.booksTabBtn.fill = Color.TAB_OFF;
    this.booksTabBtn.addEventListener("action", () => this.switchTab("books"));
    
    this.adminTabBtn = new SKButton({ text: "Admin", width: Size.TAB_WIDTH + 1, height: Size.TAB_HEIGHT });
    this.adminTabBtn.font = "bold 25px Times New Roman";
    this.adminTabBtn.fill = Color.TAB_OFF;
    this.adminTabBtn.addEventListener("action", () => this.switchTab("admin"));

    tabBar.addChild(this.membersTabBtn);
    tabBar.addChild(this.booksTabBtn);
    tabBar.addChild(this.adminTabBtn);
    this.addChild(tabBar);

    this.contentContainer = new SKContainer({width: Size.PANEL_WIDTH, height: Size.PANEL_HEIGHT});
    this.contentContainer.layoutMethod = new Layout.WrapRowLayout({ gap: 4 });
    this.contentContainer.fill = Color.MAINPANEL;
    this.addChild(this.contentContainer);
    this.updateContent();
  }

  // tab
  private switchTab(tab: "members" | "books" | "admin"): void {
    this.currentTab = tab;
    this.membersTabBtn.fill = tab === "members" ? Color.TAB_ON : Color.TAB_OFF;
    this.booksTabBtn.fill = tab === "books" ? Color.TAB_ON : Color.TAB_OFF;
    this.adminTabBtn.fill = tab === "admin" ? Color.TAB_ON : Color.TAB_OFF;
    this.updateContent();
  }

  public update(): void {
    this.updateContent();
  }

  private updateContent(): void {
    this.removeChild(this.contentContainer);
    this.contentContainer = new SKContainer({width: Size.PANEL_WIDTH, height: Size.MEMBER_SECTION_HEIGHT});
    this.contentContainer.layoutMethod = new Layout.WrapRowLayout({ gap: 12 });
    this.contentContainer.fill = Color.BACKGROUND;
    if (this.currentTab === "members") {
      this.renderMembersTab();
    } else if (this.currentTab === "books") {
      this.renderBooksTab();
    } else if (this.currentTab === "admin") {
      this.renderAdminTab();
    }
    this.addChild(this.contentContainer);
  }

  // members view
  private renderMembersTab(): void {
    const members = this.controller.listMembers();
    if (members.length === 0) {
      const emptyLabel = new SKLabel({ text: "No members yet", width: Size.PANEL_WIDTH, height: Size.PANEL_HEIGHT, align: "centre" });
      emptyLabel.font = "20px Times New Roman";
      emptyLabel.fill = Color.GRAY;
      this.contentContainer.addChild(emptyLabel);
    } else {
      members.forEach((member) => {
        const row = new SKContainer({ width: Size.PANEL_WIDTH, height: Size.MEMBER_SECTION_HEIGHT });
        row.layoutMethod = new Layout.FillRowLayout();
        row.fill = Color.BACKGROUND;

        const nameLabel = new SKLabel({ text: `${member.name} (${member.id})`, width: Size.NAMELABEL_WIDTH, height: Size.NAMELABEL_HEIGHT, align: "left" });
        nameLabel.font = "20px Times New Roman";
        nameLabel.fill = Color.GRAY;

        const countLabel = new SKLabel({ text: `Books: ${member.borrowed.length}`, width: Size.BOOKCOUNT_WIDTH, height: Size.NAMELABEL_HEIGHT, align: "right" });
        countLabel.font = "20px Times New Roman";
        countLabel.fill = Color.DAKRGRAY;

        const viewBtn = new SKButton({ text: "View", width: Size.BUTTON_WIDTH, height: Size.BUTTON_HEIGHT });
        viewBtn.fill = Color.BUTTON_COLOR;

        viewBtn.addEventListener("action", () => { if (this.onViewMember) this.onViewMember(member.id); });
        row.addChild(nameLabel);
        row.addChild(countLabel);
        row.addChild(viewBtn);
        this.contentContainer.addChild(row);
      });
    }
  }

  // books
  private renderBooksTab(): void {
    // Update the book list view before adding it
    this.bookListView.update();
    this.contentContainer.addChild(this.bookListView);
  }

  private renderAdminTab(): void {
    // Update the admin view before adding it
    this.adminView.update();
    this.contentContainer.addChild(this.adminView);
  }
}
