import { useState } from 'react';

export const enum ModalType {
  CREATE,
  UPDATE,
}

export const ModalTypeCname = {
  [ModalType.CREATE]: '创建',
  [ModalType.UPDATE]: '修改',
};

class DetailModal<T> {
  open = false;
  data?: T;
}

export function useDetailModal<DetailValue>() {
  const [detailModal, setDetailModal] = useState<DetailModal<DetailValue>>(new DetailModal());

  const detailModalShow = (data: DetailValue) => {
    setDetailModal((state) => ({
      ...state,
      open: true,
      data,
    }));
  };
  const detailModalClose = () => {
    setDetailModal((state) => ({
      ...state,
      open: false,
    }));
  };

  return {
    detailModal,
    setDetailModal,
    detailModalShow,
    detailModalClose,
  };
}
