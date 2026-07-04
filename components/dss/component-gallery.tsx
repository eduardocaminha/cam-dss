import AccordionExample from "@/components/accordion-example"
import AlertDialogExample from "@/components/alert-dialog-example"
import AlertExample from "@/components/alert-example"
import AspectRatioExample from "@/components/aspect-ratio-example"
import AttachmentExample from "@/components/attachment-example"
import AvatarExample from "@/components/avatar-example"
import BadgeExample from "@/components/badge-example"
import BreadcrumbExample from "@/components/breadcrumb-example"
import BubbleExample from "@/components/bubble-example"
import ButtonExample from "@/components/button-example"
import ButtonGroupExample from "@/components/button-group-example"
import CalendarExample from "@/components/calendar-example"
import CardExample from "@/components/card-example"
import CarouselExample from "@/components/carousel-example"
import ChartExample from "@/components/chart-example"
import CheckboxExample from "@/components/checkbox-example"
import CollapsibleExample from "@/components/collapsible-example"
import ComboboxExample from "@/components/combobox-example"
import CommandExample from "@/components/command-example"
import ContextMenuExample from "@/components/context-menu-example"
import DialogExample from "@/components/dialog-example"
import DrawerExample from "@/components/drawer-example"
import DropdownMenuExample from "@/components/dropdown-menu-example"
import EmptyExample from "@/components/empty-example"
import FieldExample from "@/components/field-example"
import HoverCardExample from "@/components/hover-card-example"
import InputExample from "@/components/input-example"
import InputGroupExample from "@/components/input-group-example"
import InputOTPExample from "@/components/input-otp-example"
import ItemExample from "@/components/item-example"
import KbdExample from "@/components/kbd-example"
import LabelExample from "@/components/label-example"
import MarkerExample from "@/components/marker-example"
import MenubarExample from "@/components/menubar-example"
import NativeSelectExample from "@/components/native-select-example"
import NavigationMenuExample from "@/components/navigation-menu-example"
import PaginationExample from "@/components/pagination-example"
import PopoverExample from "@/components/popover-example"
import ProgressExample from "@/components/progress-example"
import RadioGroupExample from "@/components/radio-group-example"
import ResizableExample from "@/components/resizable-example"
import ScrollAreaExample from "@/components/scroll-area-example"
import SelectExample from "@/components/select-example"
import SeparatorExample from "@/components/separator-example"
import SheetExample from "@/components/sheet-example"
import SidebarExample from "@/components/sidebar-example"
import SkeletonExample from "@/components/skeleton-example"
import SliderExample from "@/components/slider-example"
import SonnerExample from "@/components/sonner-example"
import SpinnerExample from "@/components/spinner-example"
import SwitchExample from "@/components/switch-example"
import TableExample from "@/components/table-example"
import TabsExample from "@/components/tabs-example"
import TextareaExample from "@/components/textarea-example"
import ToggleExample from "@/components/toggle-example"
import ToggleGroupExample from "@/components/toggle-group-example"
import TooltipExample from "@/components/tooltip-example"

export type ComponentGalleryEntry = {
  slug: string
  title: string
  Component: React.ComponentType
  /** Renders its own layout (SidebarProvider etc) instead of ExampleWrapper. */
  fullBleed?: boolean
}

export const componentGallery: ComponentGalleryEntry[] = [
  { slug: "accordion", title: "Accordion", Component: AccordionExample },
  { slug: "alert", title: "Alert", Component: AlertExample },
  { slug: "alert-dialog", title: "Alert Dialog", Component: AlertDialogExample },
  { slug: "aspect-ratio", title: "Aspect Ratio", Component: AspectRatioExample },
  { slug: "attachment", title: "Attachment", Component: AttachmentExample },
  { slug: "avatar", title: "Avatar", Component: AvatarExample },
  { slug: "badge", title: "Badge", Component: BadgeExample },
  { slug: "breadcrumb", title: "Breadcrumb", Component: BreadcrumbExample },
  { slug: "bubble", title: "Bubble", Component: BubbleExample },
  { slug: "button", title: "Button", Component: ButtonExample },
  { slug: "button-group", title: "Button Group", Component: ButtonGroupExample },
  { slug: "calendar", title: "Calendar", Component: CalendarExample },
  { slug: "card", title: "Card", Component: CardExample },
  { slug: "carousel", title: "Carousel", Component: CarouselExample },
  { slug: "chart", title: "Chart", Component: ChartExample },
  { slug: "checkbox", title: "Checkbox", Component: CheckboxExample },
  { slug: "collapsible", title: "Collapsible", Component: CollapsibleExample },
  { slug: "combobox", title: "Combobox", Component: ComboboxExample },
  { slug: "command", title: "Command", Component: CommandExample },
  { slug: "context-menu", title: "Context Menu", Component: ContextMenuExample },
  { slug: "dialog", title: "Dialog", Component: DialogExample },
  { slug: "drawer", title: "Drawer", Component: DrawerExample },
  { slug: "dropdown-menu", title: "Dropdown Menu", Component: DropdownMenuExample },
  { slug: "empty", title: "Empty", Component: EmptyExample },
  { slug: "field", title: "Field", Component: FieldExample },
  { slug: "hover-card", title: "Hover Card", Component: HoverCardExample },
  { slug: "input", title: "Input", Component: InputExample },
  { slug: "input-group", title: "Input Group", Component: InputGroupExample },
  { slug: "input-otp", title: "Input OTP", Component: InputOTPExample },
  { slug: "item", title: "Item", Component: ItemExample },
  { slug: "kbd", title: "Kbd", Component: KbdExample },
  { slug: "label", title: "Label", Component: LabelExample },
  { slug: "marker", title: "Marker", Component: MarkerExample },
  { slug: "menubar", title: "Menubar", Component: MenubarExample },
  // message/message-scroller excluded: their -example registry items require
  // @ai-sdk/react plus @/lib/ai and @/components/message-parts, which the
  // registry doesn't declare or provide. The message/bubble ui primitives
  // are still installed under components/ui.
  { slug: "native-select", title: "Native Select", Component: NativeSelectExample },
  { slug: "navigation-menu", title: "Navigation Menu", Component: NavigationMenuExample },
  { slug: "pagination", title: "Pagination", Component: PaginationExample },
  { slug: "popover", title: "Popover", Component: PopoverExample },
  { slug: "progress", title: "Progress", Component: ProgressExample },
  { slug: "radio-group", title: "Radio Group", Component: RadioGroupExample },
  { slug: "resizable", title: "Resizable", Component: ResizableExample },
  { slug: "scroll-area", title: "Scroll Area", Component: ScrollAreaExample },
  { slug: "select", title: "Select", Component: SelectExample },
  { slug: "separator", title: "Separator", Component: SeparatorExample },
  { slug: "sheet", title: "Sheet", Component: SheetExample },
  { slug: "sidebar", title: "Sidebar", Component: SidebarExample, fullBleed: true },
  { slug: "skeleton", title: "Skeleton", Component: SkeletonExample },
  { slug: "slider", title: "Slider", Component: SliderExample },
  { slug: "sonner", title: "Sonner", Component: SonnerExample },
  { slug: "spinner", title: "Spinner", Component: SpinnerExample },
  { slug: "switch", title: "Switch", Component: SwitchExample },
  { slug: "table", title: "Table", Component: TableExample },
  { slug: "tabs", title: "Tabs", Component: TabsExample },
  { slug: "textarea", title: "Textarea", Component: TextareaExample },
  { slug: "toggle", title: "Toggle", Component: ToggleExample },
  { slug: "toggle-group", title: "Toggle Group", Component: ToggleGroupExample },
  { slug: "tooltip", title: "Tooltip", Component: TooltipExample },
]
