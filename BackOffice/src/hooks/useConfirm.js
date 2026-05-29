import { useConfirm as useConfirmFromContext } from '../context/ConfirmContext';

export function useConfirm() {
  return useConfirmFromContext();
}

export default useConfirm;
