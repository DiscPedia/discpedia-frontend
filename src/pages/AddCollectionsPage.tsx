import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";

import AddCollectionHeader from "../components/collection/AddCollectionHeader";
import ConditionSelector from "../components/collection/ConditionSelector";
import type { ConditionType } from "../components/collection/ConditionSelector";
import InputField from "../components/collection/InputField";
import RecordSummaryCard from "../components/collection/RecordSummaryCard";
import SubmitBar from "../components/collection/SubmitBar";
import TextAreaField from "../components/collection/TextAreaField";
import {
	createCollection,
	type Condition,
} from "../apis/collection/collection";

type RecordItem = {
	id: number;
	label: string;
	format: string;
	title: string;
	subtitle: string;
	date: string;
  };
  

type RecordState = {
	record?: RecordItem;
};

const fallbackRecords: RecordItem[] = [
	{
		id: 1,
		label: "NEW",
		format: "CD",
		title: "리스트: 피아노 협주곡",
		subtitle: "리스트",
		date: "2025.03.31",
	},
	{
		id: 2,
		label: "NEW",
		format: "CD",
		title: "모차르트: 피아노 협주곡",
		subtitle: "모차르트",
		date: "2025.04.01",
	},
	{
		id: 3,
		label: "NEW",
		format: "CD",
		title: "브람스: 교향곡",
		subtitle: "브람스",
		date: "2025.04.05",
	},
];

const conditionMap: Record<ConditionType, Condition> = {
	새제품: "NEW",
	미개봉: "SEALED",
	중고: "USED",
};

const AddCollectionsPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();
	const aladinItemId = Number(id);

	const record = useMemo(() => {
		const stateRecord = (location.state as RecordState | null)?.record;
		const fallbackRecord = fallbackRecords.find(
			(item) => item.id === Number(id)
		);
		return stateRecord ?? fallbackRecord ?? fallbackRecords[0];
	}, [id, location.state]);

	const [condition, setCondition] = useState<ConditionType>("새제품");
	const [price, setPrice] = useState("");
	const [purchaseDate, setPurchaseDate] = useState("");
	const [store, setStore] = useState("");
	const [memo, setMemo] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		const purchasePrice = Number(price);

		if (!Number.isFinite(aladinItemId)) {
			window.alert("음반 아이템 아이디가 올바르지 않습니다.");
			return;
		}

		if (!Number.isFinite(purchasePrice) || purchasePrice < 0) {
			window.alert("구매 가격을 올바르게 입력해 주세요.");
			return;
		}

		try {
			setIsSubmitting(true);

			const data = await createCollection({
				aladinItemId,
				status: "OWNED",
				condition: conditionMap[condition],
				purchasePrice,
				purchaseDate: purchaseDate || undefined,
				purchasePlace: store || undefined,
				memo: memo || undefined,
			});

			navigate(`/collection/${data.collectionItemId}`);
		} catch {
			window.alert("컬렉션 등록에 실패했습니다.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="flex-1 w-full bg-[#F5F5F5] pb-24">
			<AddCollectionHeader
				title="내 컬렉션 추가"
				onBack={() => navigate(-1)}
			/>
			<div className="mt-4 flex flex-col gap-6">
				<RecordSummaryCard title={record.title} subtitle={record.subtitle} />
				<ConditionSelector value={condition} onChange={setCondition} />
				<InputField
					label="구매 가격 (원)"
					placeholder="예) 45000"
					type="number"
					value={price}
					onChange={setPrice}
				/>
				<InputField
					label="구매 날짜"
					placeholder=""
					type="date"
					value={purchaseDate}
					onChange={setPurchaseDate}
				/>
				<InputField
					label="구매처"
					placeholder="예) 알라딘, 바이닐샵 등"
					value={store}
					onChange={setStore}
				/>
				<TextAreaField
					label="메모"
					placeholder="예) 정말 가지고 싶었는데... 너무 좋다"
					value={memo}
					onChange={setMemo}
				/>
			</div>
			<SubmitBar
				label={isSubmitting ? "등록 중..." : "컬렉션에 등록하기"}
				onSubmit={handleSubmit}
				disabled={isSubmitting}
			/>
		</main>
	);
};

export default AddCollectionsPage;
