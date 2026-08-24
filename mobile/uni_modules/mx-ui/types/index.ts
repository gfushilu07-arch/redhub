// 全局配置类型
export type Config = {
	fontSize: number | null;
	zIndex: number;
	startDate: string;
	endDate: string;
};

// 尺寸类型，控件大小
export type Size = "small" | "normal" | "large";

// 主题类型，常用于按钮、标签等
export type Type = "primary" | "success" | "warn" | "error" | "info";

// 透传属性类型
export type PassThroughProps = {
	className?: string; // 自定义样式类名
};

// 主轴对齐方式
export type Justify = "start" | "center" | "end";

// 输入框类型支持
export type MxInputType =
	| "text" // 文本
	| "number" // 数字
	| "idcard" // 身份证
	| "digit" // 数字（带小数点）
	| "tel" // 电话
	| "safe-password" // 安全密码
	| "nickname"; // 昵称

// 文本内容类型
export type MxTextType = "default" | "phone" | "name" | "amount" | "card" | "email";

// 按钮风格类型
export type MxButtonType = "primary" | "success" | "warn" | "error" | "info" | "light" | "dark";

// 单选项类型
export type MxRadioOption = {
	label?: string; // 标签
	value: string | number | boolean; // 值
	disabled?: boolean; // 是否禁用
};

// 多选项类型
export type MxCheckboxOption = {
	label?: string; // 标签
	value: string | number | boolean; // 值
	disabled?: boolean; // 是否禁用
};

// 下拉、选择组件的值类型
export type MxSelectValue = string[] | number[] | number | string | null;

// 选择框选项类型
export type MxSelectOption = {
	label: string; // 显示文本
	value: any; // 取值
	children?: MxSelectOption[]; // 子选项
};

// 确认框动作类型
export type MxConfirmAction = "confirm" | "cancel" | "close";

// 确认框关闭事件参数
export type MxConfirmBeforeCloseEvent = {
	close: () => void; // 关闭弹窗
	showLoading: () => void; // 展示加载
	hideLoading: () => void; // 隐藏加载
};

// 确认框配置项
export type MxConfirmOptions = {
	title: string; // 标题
	message: string; // 内容
	callback?: (action: MxConfirmAction) => void; // 操作回调
	beforeClose?: (action: MxConfirmAction, event: MxConfirmBeforeCloseEvent) => void; // 关闭前回调
	confirmText?: string; // 确认按钮文案
	showConfirm?: boolean; // 是否显示确认
	cancelText?: string; // 取消按钮文案
	showCancel?: boolean; // 是否显示取消
	duration?: number; // 自动关闭时长(ms)
};

// 操作菜单项
export type MxActionSheetItem = {
	label: string; // 文本
	icon?: string; // 图标
	disabled?: boolean; // 是否禁用
	color?: string; // 自定义颜色
	callback?: () => void; // 点击回调
};

// 操作菜单配置项
export type MxActionSheetOptions = {
	list: MxActionSheetItem[]; // 操作项列表
	title?: string; // 标题
	description?: string; // 描述
	cancelText?: string; // 取消按钮文案
	showCancel?: boolean; // 是否显示取消
	maskClosable?: boolean; // 点击遮罩关闭
};

// 吐司位置类型
export type MxToastPosition = "top" | "center" | "bottom";
// 吐司类型
export type MxToastType = "success" | "warn" | "error" | "question" | "disabled" | "stop";

// 吐司配置项
export type MxToastOptions = {
	type?: MxToastType; // 类型
	icon?: string; // 自定义图标
	image?: string; // 图片
	message: string; // 内容
	position?: MxToastPosition; // 显示位置
	duration?: number; // 时长(ms)
	clear?: boolean; // 唯一吐司(清除之前的)
};

// Tabs组件的单项类型
export type MxTabsItem = {
	label: string; // 标签文本
	value: string | number; // 对应值
	disabled?: boolean; // 是否禁用
};

// 列表项类型
export type MxListItem = {
	label: string; // 标题
	content?: string; // 内容描述
	icon?: string; // 左侧图标
	arrow?: boolean; // 是否展示箭头
	hoverable?: boolean; // 是否可点击高亮
	disabled?: boolean; // 是否禁用
};

// 列表视图单项
export type MxListViewItem = {
	label?: string; // 节点标签
	value?: any; // 节点值
	index?: string; // 索引
	children?: MxListViewItem[]; // 子项
};

// 列表分组
export type MxListViewGroup = {
	index: string; // 分组索引
	children: MxListViewItem[]; // 分组数据
};

// 虚拟滚动列表项类型
export type MxListViewVirtualItem = {
	key: string; // 唯一标识
	type: "header" | "item"; // 类型
	index: number; // 排序索引
	top: number; // 距离顶部像素
	height: number; // 高度
	data: MxListViewItem; // 数据
};

// 下拉刷新状态
export type MxListViewRefresherStatus = "default" | "pulling" | "refreshing";

// 多级联动选项(复用列表项类型)
export type MxCascaderOption = MxListViewItem;

// 弹窗出现方向
export type MxPopupDirection = "top" | "right" | "bottom" | "center" | "left";

// 二维码样式
export type MxQrcodeMode = "rect" | "circular" | "line" | "rectSmall";

// 上传项
export type MxUploadItem = {
	uid: string; // 唯一标识
	preview: string; // 预览图
	url: string; // 真实地址
	progress: number; // 上传进度(0-100)
};

// 日期选择快捷项
export type MxSelectDateShortcut = {
	label: string; // 显示文本
	value: string[]; // 日期范围数组
};

// 表单规则类型
export type MxFormRule = {
	required?: boolean; // 是否必填
	message?: string; // 错误信息
	min?: number; // 最小长度
	max?: number; // 最大长度
	pattern?: RegExp; // 正则验证
	validator?: (value: any | null) => boolean | string; // 自定义验证函数
};

// 表单校验错误信息
export type MxFormValidateError = {
	field: string; // 错误字段
	message: string; // 错误信息
};

// 表单校验返回结果
export type MxFormValidateResult = {
	valid: boolean; // 是否通过校验
	errors: MxFormValidateError[]; // 错误列表
};

// 表单标签布局方式
export type MxFormLabelPosition = "left" | "top" | "right";

// 筛选项类型
export type MxFilterItemType = "switch" | "sort" | "select";

// 筛选项实体
export type MxFilterItem = {
	label: string; // 筛选标签
	value: any; // 值
	type: MxFilterItemType; // 类型
	options?: MxSelectOption[]; // 选项
};

// 树结构项
export type MxTreeItem = {
	id: string | number; // 节点唯一标识
	label: string; // 节点文本
	disabled?: boolean; // 是否禁用
	children?: MxTreeItem[]; // 子节点
	value?: UTSJSONObject; // 扩展数据
	isExpand?: boolean; // 是否展开
	isChecked?: boolean; // 是否选中
	isHalfChecked?: boolean; // 部分选中
};

// 树节点信息
export type MxTreeNodeInfo = {
	node: MxTreeItem; // 当前节点
	parent?: MxTreeItem; // 父节点
	index: number; // 索引
};

// 日历类型
export type MxCalendarMode = "single" | "multiple" | "range";

// 日历日期配置
export type MxCalendarDateConfig = {
	date: string; // 日期字符串
	topText?: string; // 顶部文案
	bottomText?: string; // 底部文案
	disabled?: boolean; // 是否禁用
	color?: string; // 文字颜色
};

// 跑马灯滚动方向
export type MxMarqueeDirection = "horizontal" | "vertical";

// 跑马灯单项
export type MxMarqueeItem = {
	url: string; // 跳转链接
	originalIndex: number; // 原始下标
};

// 跑马灯透传属性
export type MxMarqueePassThrough = {
	className?: string; // 自定义样式类名
	container?: PassThroughProps; // 容器
	item?: PassThroughProps; // 条目
	image?: PassThroughProps; // 图片
};

// 跑马灯组件属性
export type MxMarqueeProps = {
	className?: string; // 容器样式类
	pt?: MxMarqueePassThrough; // 透传属性
	list?: string[]; // 数据列表
	direction?: MxMarqueeDirection; // 滚动方向
	speed?: number; // 滚动速度
	pause?: boolean; // 是否暂停
	pauseOnHover?: boolean; // 悬浮是否暂停
	itemHeight?: number; // 行高
	itemWidth?: number; // 项宽
	gap?: number; // 项间距
};

// 图标内容配置
export type MxIconContent = {
	font: string; // 字体名称
	text: string; // 图标文本
};

// 选座项
export type MxSelectSeatItem = {
	row: number; // 行号
	col: number; // 列号
	disabled?: boolean; // 是否禁用
	empty?: boolean; // 是否为空位（不渲染但保留位置）
	color?: string; // 默认颜色
	bgColor?: string; // 默认背景色
	borderColor?: string; // 边框颜色
	selectedBgColor?: string; // 选中背景色
	selectedColor?: string; // 选中图标颜色
	selectedIcon?: string; // 选中图标名称
	icon?: string; // 图标名称
	image?: string; // 默认图片
	selectedImage?: string; // 选中图片
};

// 选中座位的值
export type MxSelectSeatValue = {
	row: number; // 行号
	col: number; // 列号
};

// tabbar 项类型
export type MxTabbarItem = {
	icon?: string;
	selectedIcon?: string;
	value: string;
	text?: string;
};
