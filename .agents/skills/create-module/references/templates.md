# 模块模板片段

下面的片段是最小可复制骨架。真正落地时，字段、DTO、权限码、查询条件要根据业务调整。

## 1. server entity

```ts
import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@/common/base.entity";

@Entity({ orderBy: { create_date: "DESC" } })
export class ModuleName extends BaseEntity {
	@PrimaryGeneratedColumn()
	@ApiProperty({ description: "ID" })
	id: number;

	@Column()
	@ApiProperty({ description: "标题" })
	title: string;

	@Column({ default: "" })
	@ApiProperty({ description: "描述" })
	desc: string;

	@Column({ default: true })
	@ApiProperty({ description: "是否可用" })
	is_available: boolean;

	@Column({ default: 0 })
	@ApiProperty({ description: "排序值" })
	recommend: number;

	@Column({ default: false })
	@ApiProperty({ description: "是否删除" })
	is_delete: boolean;
}
```

## 2. server module

```ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ModuleNameController } from "./module-name.controller";
import { ModuleName } from "./module-name.entity";
import { ModuleNameService } from "./module-name.service";

@Module({
	imports: [TypeOrmModule.forFeature([ModuleName])],
	controllers: [ModuleNameController],
	providers: [ModuleNameService],
	exports: [ModuleNameService],
})
export class ModuleNameModule {}
```

## 3. server service（默认带内容国际化）

```ts
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { ContentLang } from "@/constants";
import { CRUDQuery } from "@/interface";
import { createOrder, isDefaultI18nLang } from "@/utils";
import { paginationTransform } from "@/utils/whereTransform";
import { ContentTranslationService, StringKeys } from "../content_translation/content_translation.service";
import { ModuleNameCreateDto, ModuleNameUpdateDto } from "./module-name.dto";
import { ModuleName } from "./module-name.entity";

@Injectable()
export class ModuleNameService {
	static I18N_KEY = "module-name";
	static I18N_FIELDS: StringKeys<ModuleName>[] = ["title", "desc"];

	constructor(
		@InjectRepository(ModuleName)
		readonly repository: Repository<ModuleName>,
		private readonly contentTranslationService: ContentTranslationService,
	) {}

	findList({ keyword = "", ...params }: CRUDQuery<ModuleName>, lang?: ContentLang) {
		const { skip, take } = paginationTransform(params);
		const { order } = createOrder(params) || {};
		const find = this.repository
			.createQueryBuilder("module_name")
			.where({
				is_delete: false,
				title: Like(`%${keyword.trim()}%`),
			})
			.skip(skip)
			.take(take);

		Object.entries(order || {}).forEach(([key, value]) => {
			find.addOrderBy(`module_name.${key}`, value);
		});

		return find.getManyAndCount().then(([list, total]) => {
			if (lang && !isDefaultI18nLang(lang)) {
				return this.contentTranslationService
					.overlayTranslations(list, {
						entity: ModuleNameService.I18N_KEY,
						fields: ModuleNameService.I18N_FIELDS,
						lang,
					})
					.then((patched) => [patched, total] as const);
			}
			return [list, total] as const;
		});
	}

	async findById(id: number, lang?: ContentLang) {
		const info = await this.repository.findOneBy({ id, is_delete: false });
		if (!info) {
			throw new BadRequestException("数据不存在");
		}
		if (lang && !isDefaultI18nLang(lang)) {
			const [patched] = await this.contentTranslationService.overlayTranslations([info], {
				entity: ModuleNameService.I18N_KEY,
				fields: ModuleNameService.I18N_FIELDS,
				lang,
			});
			return patched;
		}
		return info;
	}

	create(data: ModuleNameCreateDto) {
		return this.repository.save(data);
	}

	update(data: ModuleNameUpdateDto) {
		return this.repository.update(data.id, data);
	}

	remove(id: number) {
		return this.repository.update(id, { is_delete: true });
	}
}
```

## 4. server controller

```tsx
import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ModuleNamePage } from "@cms/ssr/pages";
import { createPermGroup } from "@/common/common.permission";
import Lang from "@/common/lang.decorator";
import { ContentLang } from "@/constants";
import { ResponseResult } from "@/interface";
import { AdminRoleGuard } from "@/modules/user_admin_role/user_admin_role.guard";
import { successResponse } from "@/utils";
import { RenderView } from "../render_view/render_view.decorator";
import {
	ModuleNameCreateDto,
	ModuleNameDetailResponseDto,
	ModuleNameListResponseDto,
	ModuleNameQueryListDto,
	ModuleNameUpdateDto,
} from "./module-name.dto";
import { ModuleNameService } from "./module-name.service";

const MODULE_NAME = "模块名称";
const createPerm = createPermGroup(MODULE_NAME);

@ApiTags(MODULE_NAME)
@Controller()
export class ModuleNameController {
	constructor(private readonly services: ModuleNameService) {}

	@Get("/module-name")
	@RenderView(ModuleNamePage)
	async view(@Query() query: { current?: number }, @Lang() lang: ContentLang) {
		const [list, total] = await this.services.findList(
			{
				current: query.current || 1,
				page_size: 20,
			},
			lang,
		);
		return {
			title: "模块页面",
			dataList: list,
			total,
		};
	}

	@Post("/api/admin/module-name/list")
	@ApiOkResponse({ type: ModuleNameListResponseDto })
	@ApiBody({ type: ModuleNameQueryListDto })
	@AdminRoleGuard(createPerm("admin:module-name:list", `获取${MODULE_NAME}列表`))
	async apiList(@Body() body: ModuleNameQueryListDto) {
		const [list, total] = await this.services.findList(body);
		return successResponse({ list, total });
	}

	@Post("/api/admin/module-name/create")
	@ApiOkResponse({ type: ModuleNameDetailResponseDto })
	@AdminRoleGuard(createPerm("admin:module-name:create", `新增${MODULE_NAME}`))
	async apiCreate(@Body() data: ModuleNameCreateDto) {
		const result = await this.services.create(data);
		return successResponse(result, "创建成功");
	}

	@Post("/api/admin/module-name/update")
	@ApiOkResponse({ type: ResponseResult<number> })
	@AdminRoleGuard(createPerm("admin:module-name:update", `修改${MODULE_NAME}`))
	async apiUpdate(@Body() data: ModuleNameUpdateDto) {
		await this.services.update(data);
		return successResponse(data.id, "修改成功");
	}
}
```

## 5. SSR page（`clients/ssr/src/pages/module-name/index.tsx`）

```tsx
import { MainLayout } from "../../layouts/main";
import type { PageComponentProps } from "../../runtime/types";

interface ModuleNameItem {
	id: number;
	title?: string;
	desc?: string;
}

interface ModuleNamePageData {
	title?: string;
	dataList: ModuleNameItem[];
	total: number;
}

export function ModuleNamePage({
	pageData,
	t,
}: PageComponentProps<ModuleNamePageData>) {
	return (
		<MainLayout>
			<section className="mx-auto max-w-6xl space-y-6 px-6 py-10">
				<div className="space-y-2">
					<div className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
						{t("module_name", "模块")}
					</div>
					<h1 className="text-4xl font-black tracking-tight text-slate-900">
						{pageData.title || "模块页面"}
					</h1>
				</div>
				<div className="grid gap-4">
					{pageData.dataList.map((item) => (
						<article
							key={item.id}
							className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
						>
							<div className="text-2xl font-black tracking-tight text-slate-900">
								{item.title}
							</div>
							{item.desc ? (
								<div className="mt-2 text-sm text-slate-600">{item.desc}</div>
							) : null}
						</article>
					))}
				</div>
			</section>
		</MainLayout>
	);
}
```

别忘了补充：

```ts
// clients/ssr/src/pages/index.ts
export * from "./module-name";
```

## 6. admin module/services.ts

```ts
import {
	ModuleNameCreateDto,
	ModuleNameDetailResponseDto,
	ModuleNameListResponseDto,
	ModuleNameQueryListDto,
	ModuleNameUpdateDto,
} from "@cms/api-interface";
import { request, AIP_FIX } from "@/request";
import { Result } from "@/types";

export const getListApi = (body: ModuleNameQueryListDto) => {
	return request.post<ModuleNameListResponseDto>(`${AIP_FIX}/module-name/list`, body);
};

export const getDetailApi = (id: number) => {
	return request.post<ModuleNameDetailResponseDto>(`${AIP_FIX}/module-name/info`, { id });
};

export const createApi = (body: ModuleNameCreateDto) => {
	return request.post<Result<string>>(`${AIP_FIX}/module-name/create`, body);
};

export const updateApi = (body: ModuleNameUpdateDto) => {
	return request.post<Result<string>>(`${AIP_FIX}/module-name/update`, body);
};

export const removeApi = (id: number) => {
	return request.post<Result<number>>(`${AIP_FIX}/module-name/delete`, { id });
};
```

## 7. admin module/index.ts

```ts
export * from "./services";
```

## 8. admin list.tsx，模态框 CRUD

```tsx
import type { ModuleNameCreateDto, ModuleNameInfo, ModuleNameUpdateDto } from "@cms/api-interface";
import { createFileRoute } from "@tanstack/react-router";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Button, Form, Input, Modal, Popconfirm, Space, Switch } from "antd";
import { useRef, useState } from "react";
import { AvailableSwitch } from "@/components/Available";
import PageTable from "@/components/PageTable";
import { RecommendFormItem } from "@/components/RecommendFormItem";
import { TableColumnSort } from "@/components/TableColumnSort";
import { ModalType, useFormModal } from "@/hooks/useFormModal";
import { createI18nColumn, transformPagination, transformSort } from "@/utils";
import { message } from "@/utils/notice";
import { createApi, getListApi, removeApi, updateApi } from "./module";

type TableItem = ModuleNameInfo;
type FormValues = ModuleNameCreateDto | ModuleNameUpdateDto;
const i18nColumn = createI18nColumn<TableItem>("module-name");

export default function ModuleNamePage() {
	const [searchForm, setSearchForm] = useState({ keyword: "" });
	const tableRef = useRef<ActionType | undefined>(undefined);
	const formModal = useFormModal<FormValues>({
		submit: (values, modal) =>
			modal.type === ModalType.UPDATE
				? updateApi(values as ModuleNameUpdateDto).then(() => tableRef.current?.reload?.())
				: createApi(values as ModuleNameCreateDto).then(() => tableRef.current?.reload?.()),
	});

	const columns: ProColumns<TableItem>[] = [
		i18nColumn({ dataIndex: "title", title: "名称" }),
		i18nColumn({ dataIndex: "desc", title: "描述" }),
		{
			dataIndex: "recommend",
			title: "排序",
			render: (_, row) => (
				<TableColumnSort
					value={row.recommend}
					request={(value) => updateApi({ id: row.id, recommend: value } as ModuleNameUpdateDto)}
				/>
			),
		},
		{
			dataIndex: "is_available",
			title: "是否可用",
			render: (_, row) => (
				<AvailableSwitch
					value={row.is_available}
					tableRef={tableRef}
					request={() => updateApi({ id: row.id, is_available: !row.is_available } as ModuleNameUpdateDto)}
				/>
			),
		},
		{
			dataIndex: "operate",
			title: "操作",
			render: (_, row) => (
				<Space>
					<a
						onClick={() => {
							formModal.form.setFieldsValue(row);
							formModal.formModalShow(ModalType.UPDATE);
						}}
					>
						编辑
					</a>
					<Popconfirm
						title="确定删除吗？"
						onConfirm={() => removeApi(row.id).then(() => tableRef.current?.reload?.())}
					>
						<a>删除</a>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<PageTable<TableItem>
				rowKey="id"
				search={false}
				columns={columns}
				actionRef={tableRef}
				request={(params, sorter) =>
					getListApi({
						...transformPagination(params),
						...transformSort(sorter),
						...searchForm,
					}).then(({ data }) => ({ data: data.data.list, total: data.data.total || 0 }))
				}
				headerTitle={
					<Input.Search
						value={searchForm.keyword}
						onChange={(e) => setSearchForm({ keyword: e.target.value.trim() })}
						onSearch={() => tableRef.current?.reload?.()}
					/>
				}
				toolBarRender={() => [
					<Button key="create" type="primary" onClick={() => formModal.formModalShow()}>
						新增
					</Button>,
				]}
			/>
			<Modal
				open={formModal.formModal.open}
				title={`${formModal.formModalTitle}模块`}
				onCancel={formModal.formModalClose}
				onOk={formModal.submitHandler}
				confirmLoading={formModal.submitLoading}
			>
				<Form form={formModal.form} labelCol={{ span: 4 }}>
					<Form.Item label="ID" name="id" hidden>
						<Input disabled />
					</Form.Item>
					<Form.Item label="标题" name="title" rules={[{ required: true }]}>
						<Input />
					</Form.Item>
					<Form.Item label="上架状态" name="is_available" valuePropName="checked">
						<Switch checkedChildren="上架" unCheckedChildren="下架" />
					</Form.Item>
					<RecommendFormItem />
				</Form>
			</Modal>
		</>
	);
}

export const Route = createFileRoute("/_main/module-name/list")({
	component: ModuleNamePage,
});
```

## 8. 模块国际化接入清单

```md
- 选定稳定的国际化实体 key，推荐直接使用模块目录名
- 列出需要翻译的字段，仅包含字符串类字段
- server service 注入 `ContentTranslationService`
- 在 `findList` / `findById` / `findNextAndPrev` / `findAll` 等读取方法中，对非默认语言调用 `overlayTranslations`
- SSR 或公开接口读取内容时，controller 使用 `@Lang()` 传入语言
- admin 列表页创建 `const i18nColumn = createI18nColumn<TableItem>("{module}")`
- 对标题、描述、正文、图片、链接等可翻译列，替换为 `i18nColumn(...)`
- 富文本、低代码、图片等字段，补充正确的 `transType`
- 默认语言内容继续由业务表单维护，翻译内容通过翻译抽屉维护
- 如需类型更新，修改 server 源码后走既有 Swagger 生成流程，不手改 `packages/api-interface/index.ts`
```

## 9. admin 独立 create/update 页面

`create.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import ModuleNameFormPage from "./module/Form";

export const Route = createFileRoute("/_main/module-name/create")({
	component: ModuleNameFormPage,
});
```

`update.$id.tsx`

```tsx
import { createFileRoute } from "@tanstack/react-router";
import ModuleNameFormPage from "./module/Form";

export const Route = createFileRoute("/_main/module-name/update/$id")({
	component: ModuleNameFormPage,
});
```

## 9. SSR view.tsx

```tsx
interface ModuleNamePageProps {
	dataList: Array<{ id: number; title: string; desc?: string }>;
}

export function ModuleNamePage({ dataList }: ModuleNamePageProps) {
	return (
		<div className="module-name-page">
			{dataList.map((item) => (
				<a key={item.id} href={`/module-name/${item.id}`} className="item">
					<div className="title">{item.title}</div>
					<div className="desc">{item.desc}</div>
				</a>
			))}
		</div>
	);
}
```

## 10. SSR style.scss

```scss
.module-name-page {
	display: grid;
	gap: 24px;

	.item {
		display: block;
		padding: 24px;
		border: 1px solid #e5e7eb;
		text-decoration: none;
		color: #111827;
	}

	.title {
		font-size: 20px;
		font-weight: 600;
	}

	.desc {
		margin-top: 12px;
		color: #6b7280;
	}
}
```

## 11. SSR main.ts，可选

只有在当前构建链要求模块级入口时才创建。当前 `news` 参考模块没有这个文件。

```ts
import "./style.scss";

export * from "./view";
```
