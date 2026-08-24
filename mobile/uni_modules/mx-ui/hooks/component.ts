import { parse } from "@/.mx";
import type { MxCascaderOption, MxListViewItem, MxTreeItem } from "../types";

export function useListView(data: UTSJSONObject[]) {
	return data.map((e) => {
		return parse<MxListViewItem>({
			...e,
			value: e
		})!;
	});
}

export function useCascader(data: UTSJSONObject[]) {
	return data.map((e) => parse<MxCascaderOption>(e)!);
}

export function useTree(data: UTSJSONObject[]) {
	return data.map((e) => {
		return parse<MxTreeItem>({
			...e,
			value: e
		})!;
	});
}
