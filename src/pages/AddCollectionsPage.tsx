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
  updateCollection,
  getCollectionAlbumAladinItemId,
  type Condition,
  type CollectionItemDetail,
} from "../apis/collection/collection";

type RecordItem = {
  id: number;
  label: string;
  format: string;
  title: string;
  subtitle: string;
  date: string;
  coverImageUrl?: string;
};

type RecordState = {
  record?: RecordItem;
  mode?: "edit";
  collectionItemId?: number;
  aladinItemId?: number;
  item?: CollectionItemDetail;
};

const conditionMap: Record<ConditionType, Condition> = {
  새제품: "NEW",
  미개봉: "SEALED",
  중고: "USED",
};

const conditionLabelMap: Record<Condition, ConditionType> = {
  NEW: "새제품",
  SEALED: "미개봉",
  USED: "중고",
};

const getFormDefaults = (item?: CollectionItemDetail) => ({
  condition: item?.condition
    ? (conditionLabelMap[item.condition] ?? "새제품")
    : "새제품",
  price:
    typeof item?.purchasePrice === "number"
      ? String(item.purchasePrice)
      : "",
  purchaseDate: item?.purchaseDate ?? "",
  store: item?.purchasePlace ?? item?.purchaseStore ?? "",
  memo: item?.memo ?? "",
});

const AddCollectionsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const routeState = location.state as RecordState | null;
  const isEdit = routeState?.mode === "edit" && !!routeState.collectionItemId;
  const editItem = routeState?.item;

  /** URL /collection/add/:id — aladinItemId */
  const aladinItemIdFromUrl = Number(id);
  const resolvedAladinItemId =
    routeState?.aladinItemId ??
    (editItem
      ? getCollectionAlbumAladinItemId(editItem.album)
      : aladinItemIdFromUrl);

  const record = useMemo((): RecordItem | null => {
    if (editItem) {
      return {
        id: resolvedAladinItemId,
        label: editItem.status === "WISHLIST" ? "WISHLIST" : "OWNED",
        format: editItem.album.mediaType,
        title: editItem.album.title,
        subtitle: editItem.album.artistName,
        date: editItem.album.releaseDate,
        coverImageUrl: editItem.album.coverImageUrl,
      };
    }

    return routeState?.record ?? null;
  }, [editItem, resolvedAladinItemId, routeState]);

  const formDefaults = useMemo(
    () => getFormDefaults(editItem),
    [editItem],
  );

  const [condition, setCondition] = useState<ConditionType>(
    () => formDefaults.condition,
  );
  const [price, setPrice] = useState(() => formDefaults.price);
  const [purchaseDate, setPurchaseDate] = useState(
    () => formDefaults.purchaseDate,
  );
  const [store, setStore] = useState(() => formDefaults.store);
  const [memo, setMemo] = useState(() => formDefaults.memo);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const purchasePrice = Number(price);

    if (
      !Number.isFinite(resolvedAladinItemId) ||
      resolvedAladinItemId <= 0
    ) {
      window.alert("음반 아이디가 올바르지 않습니다.");
      return;
    }

    if (!isEdit && (!Number.isFinite(aladinItemIdFromUrl) || aladinItemIdFromUrl <= 0)) {
      window.alert("음반 아이디가 올바르지 않습니다.");
      return;
    }

    if (!Number.isFinite(purchasePrice) || purchasePrice < 0) {
      window.alert("구매 가격을 올바르게 입력해 주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEdit && routeState?.collectionItemId) {
        await updateCollection(routeState.collectionItemId, {
          aladinItemId: resolvedAladinItemId,
          status: editItem?.status ?? "OWNED",
          condition: conditionMap[condition],
          purchasePrice,
          purchaseDate: purchaseDate || undefined,
          purchasePlace: store || undefined,
          memo: memo || undefined,
        });
        navigate(`/collection/${routeState.collectionItemId}`, {
          replace: true,
        });
        return;
      }

      const data = await createCollection({
        aladinItemId: aladinItemIdFromUrl,
        status: "OWNED",
        condition: conditionMap[condition],
        purchasePrice,
        purchaseDate: purchaseDate || undefined,
        purchasePlace: store || undefined,
        memo: memo || undefined,
      });
      navigate(`/collection/${data.collectionItemId}`);
    } catch {
      window.alert(
        isEdit ? "컬렉션 수정에 실패했습니다." : "컬렉션 등록에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!record) {
    return (
      <main className="flex-1 w-full bg-[#F5F5F5] px-5 pb-24">
        <AddCollectionHeader
          title={isEdit ? "컬렉션 수정" : "내 컬렉션 추가"}
          onBack={() => navigate(-1)}
        />
        <p className="mt-8 text-center text-sm text-gray-500">
          음반 정보를 불러올 수 없습니다.
          <br />
          상세 페이지에서 다시 시도해 주세요.
        </p>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full bg-[#F5F5F5] pb-24">
      <AddCollectionHeader
        title={isEdit ? "컬렉션 수정" : "내 컬렉션 추가"}
        onBack={() => navigate(-1)}
      />
      <div className="mt-4 flex flex-col gap-6">
        <RecordSummaryCard
          title={record.title}
          subtitle={record.subtitle}
          coverImageUrl={record.coverImageUrl}
        />
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
        label={
          isSubmitting
            ? isEdit
              ? "수정 중..."
              : "등록 중..."
            : isEdit
              ? "수정 완료"
              : "컬렉션에 등록하기"
        }
        onSubmit={handleSubmit}
        disabled={isSubmitting}
      />
    </main>
  );
};

export default AddCollectionsPage;
