import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMemo, useState } from "react";

import AddCollectionHeader from "../components/collection/AddCollectionHeader";
import ConditionSelector from "../components/collection/ConditionSelector";
import type { ConditionType } from "../components/collection/ConditionSelector";
import InputField from "../components/collection/InputField";
import RecordSummaryCard from "../components/collection/RecordSummaryCard";
import SubmitBar from "../components/collection/SubmitBar";
import TextAreaField from "../components/collection/TextAreaField";
import type { RecordItem } from "../types/record";

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

const AddCollectionsPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();

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

	const handleSubmit = async () => {
		const payload = {
			recordId: record.id,
			condition,
			price,
			purchaseDate,
			store,
			memo,
		};

		await Promise.resolve(payload);
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
			<SubmitBar label="컬렉션에 등록하기" onSubmit={handleSubmit} />
		</main>
	);
};

export default AddCollectionsPage;
