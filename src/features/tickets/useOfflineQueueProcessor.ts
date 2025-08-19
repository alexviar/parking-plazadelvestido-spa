import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIsOnline } from '../../commons/hooks/useIsOnline'
import { useCreateTicketMutation } from './api/ticketsApi'
import { addItem, removeItem, updateItem, type OfflineItem } from './redux/offlineQueueSlice'

export const useOfflineQueueProcessor = () => {
  const dispatch = useDispatch()
  const [createTicket] = useCreateTicketMutation()

  const offlineQueue = useSelector((state: any) => state.offlineQueue)
  const queueRef = useRef(offlineQueue)
  queueRef.current = offlineQueue

  const resolverRef = useRef<null | (() => void)>(null)
  useEffect(() => {
    if (resolverRef.current) {
      resolverRef.current()
      resolverRef.current = null
    }
  }, [offlineQueue])

  const isOnline = useIsOnline()
  const isOnlineRef = useRef(isOnline)
  isOnlineRef.current = isOnline
  const waitForNetworkToBeOnlineResolverRef = useRef<null | (() => void)>(null)
  useEffect(() => {
    if (isOnline && waitForNetworkToBeOnlineResolverRef.current) {
      waitForNetworkToBeOnlineResolverRef.current()
      waitForNetworkToBeOnlineResolverRef.current = null
    }
  }, [isOnline])

  useEffect(() => {
    let isCancelled = false

    const waitForNextChange = () =>
      new Promise<void>(resolve => {
        resolverRef.current = resolve
      })

    const waitForNetworkToBeOnline = () =>
      new Promise<void>(resolve => {
        waitForNetworkToBeOnlineResolverRef.current = resolve
      })

    const getNextItem = async () => {
      const pendingItems = queueRef.current.filter((i: OfflineItem) => i.status === 'pending' || i.status === 'failed')
      if (pendingItems.length === 0) {
        await waitForNextChange()
      }
      return pendingItems[pendingItems.length - 1]
    }

    const worker = async () => {
      while (!isCancelled) {
        const nextItem = await getNextItem()

        if (!isOnlineRef.current) {
          await waitForNetworkToBeOnline()
        }

        if (nextItem) {
          dispatch(updateItem({ ...nextItem, status: 'syncing' }))
          try {
            await createTicket(nextItem.data).unwrap()
            // dispatch(removeItem(nextItem.id))
            dispatch(updateItem({ ...nextItem, status: 'synced' }))
          } catch (error) {
            console.error('Failed to sync offline item:', error)
            dispatch(addItem({ data: nextItem.data, status: 'failed' }))
            dispatch(removeItem(nextItem.id))
          }
        }
      }
    }

    worker()
    return () => {
      isCancelled = true
      if (resolverRef.current) {
        resolverRef.current()
      }
    }
  }, [dispatch, createTicket])
}
