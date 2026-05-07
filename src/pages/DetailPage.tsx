import { useLocation, useNavigate, useParams } from "react-router-dom";

import AlbumHero from "../components/detail/AlbumHero";
import BottomCTA from "../components/detail/BottomCTA";
import DetailHeader from "../components/detail/DetailHeader";
import PriceInfo from "../components/detail/PriceInfo";
import ProductInfo from "../components/detail/ProductInfo";
import ReviewList from "../components/detail/ReviewList";
import ReviewSummary from "../components/detail/ReviewSummary";
import SpecList from "../components/detail/SpecList";

type RecordState = {
	record?: {
		id: number;
		label: string;
		format: string;
		title: string;
		subtitle: string;
		date: string;
	};
};

const fallbackRecords = [
	{
		id: 1,
		label: "PRE-ORDER",
		format: "CD",
		title: "정규 4집 개화",
		subtitle: "악뮤",
		date: "2026.04.07",
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

const DetailPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();
	const stateRecord = (location.state as RecordState | null)?.record;
	const fallbackRecord = fallbackRecords.find(
		(item) => item.id === Number(id)
	);
	const record = stateRecord ?? fallbackRecord ?? fallbackRecords[0];

	const specItems = [
		"1 CD (스탠다드 블랙 / 컬러 바이닐 랜덤 발송)",
		"포스터, 가사지, 포토카드 포함 (초회 한정판 기준)",
		"악뮤 (AKMU) · 정규 4집 개화 · 하드커버 북+CD+가사지",
	];

	const reviewDistribution = [
		{ score: 5, percent: 70 },
		{ score: 4, percent: 45 },
		{ score: 3, percent: 15 },
		{ score: 2, percent: 8 },
		{ score: 1, percent: 3 },
	];

	const reviews = [
		{
			id: 1,
			name: "음악매니아",
			score: 5,
			content: "응원이 너무 좋네요, 역시 명반입니다. 꼭 들어보세요!",
			date: "2026.04.05",
		},
		{
			id: 2,
			name: "바이닐러버",
			score: 4,
			content: "패키징이 아쉽지만 음악은 완벽합니다.",
			date: "2026.04.02",
		},
		{
			id: 3,
			name: "뉴비",
			score: 4.5,
			content: "처음 입문하기 좋은 앨범인 것 같아요. 추천합니다.",
			date: "2026.03.28",
		},
	];

  return (
		<main className="flex-1 w-full bg-[#F5F5F5] pb-24">
			<div className="relative">
				<AlbumHero coverAlt={record.title} />
				<DetailHeader onBack={() => navigate(-1)} />
			</div>

			<ProductInfo
				status={record.label}
				format={record.format}
				genre="한국가요·팝/댄스/R&B"
				title={record.title}
				artist={record.subtitle}
			/>
			<PriceInfo
        releaseDate={record.date}
        originalPrice="24,000원"
        price="20,800원"
      />
			<SpecList items={specItems} />
			<ReviewSummary rating={4.5} totalReviews={3} distribution={reviewDistribution} />
			<ReviewList items={reviews} />
			<BottomCTA label="내 컬렉션에 추가하기" />
		</main>
	);
};

export default DetailPage;
