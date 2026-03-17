import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../common/base.entity";

/** 业务配置 */
@Entity({ name: "business_config", orderBy: { create_date: "DESC" } })
export class BusinessConfig extends BaseEntity {
	@ApiProperty({
		description: "业务配置 ID",
	})
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({
		description: "编码",
	})
	@Index()
	@IsNotEmpty()
	@Column()
	code: string;

	@ApiProperty({
		description: "业务配置标题",
	})
	@IsNotEmpty()
	@Column()
	title: string;

	@ApiProperty({
		description: "业务配置内容类型",
	})
	@Column({ default: "" })
	content_type: string;

	@ApiProperty({
		description: "业务配置详情",
	})
	@Column({ type: "text", nullable: true })
	content: string;

	@ApiProperty({
		description: "是否可用",
	})
	@Column({ default: true })
	is_available: boolean;

	@ApiProperty({
		description: "是否已删除",
	})
	@Column({ default: false })
	is_delete: boolean;
}
