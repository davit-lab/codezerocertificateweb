
import Gun from 'gun';
import { UserApproval } from '../types';

// Connect to a public Gun relay for cross-device sync
const gun = Gun({
  peers: ['https://gun-manhattan.herokuapp.com/gun'],
  localStorage: false // We rely on the relay for cross-device state
});

const examRoom = gun.get('web_exam_academy_2025_v1');

export const db = {
  requestAccess: (name: string, callback: (id: string) => void) => {
    const id = Math.random().toString(36).substring(7);
    const data: UserApproval = {
      id,
      name,
      status: 'pending',
      timestamp: Date.now()
    };
    
    examRoom.get('approvals').get(id).put(data);
    callback(id);
  },

  approveUser: (id: string) => {
    examRoom.get('approvals').get(id).get('status').put('approved');
  },

  subscribeToApprovals: (callback: (approvals: UserApproval[]) => void) => {
    const approvalsMap: Record<string, UserApproval> = {};
    
    const listener = examRoom.get('approvals').map().on((data: any, id: string) => {
      if (data && typeof data === 'object' && data.name) {
        approvalsMap[id] = {
          id: data.id,
          name: data.name,
          status: data.status as any,
          timestamp: data.timestamp
        };
        callback(Object.values(approvalsMap));
      }
    });

    return () => {
      // Cleanup happens via Gun's internal handling when nodes are GCed
      // but we can nullify the map reference in the app component
    };
  },

  subscribeToUserStatus: (id: string, callback: (status: string) => void) => {
    const listener = examRoom.get('approvals').get(id).get('status').on((status: string) => {
      if (status) callback(status);
    });
    return listener;
  },

  clearAll: () => {
    examRoom.get('approvals').put(null as any);
  }
};
