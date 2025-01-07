import { defineStore } from "pinia";
import type { IUser } from "@/types/user.types";

export type MemberStoreState = {
  data: IUser[] | null;
  member: IUser | null;
  isLoading: boolean;
  error: string | null;
};

export const useMemberStore = defineStore({
  id: "memberStore",
  state: (): MemberStoreState => ({
    data: null,
    member: null,
    isLoading: false,
    error: null,
  }),
  getters: {},
  actions: {
    setMembers(members: IUser[]): void {
      this.data = members;
    },
    setMember(member: IUser | null): void {
      this.member = member;
    },
    setLoading(loading: boolean): void {
      this.isLoading = loading;
    },
    async fetchData(params: string): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        params = params
          ? `${params}&action=get_members&token=${localStorage.sessionId}`
          : `action=get_members&token=${localStorage.sessionId}`;
        const members = await $fetch<IUserListResponse[]>(
          `/api/member?${params}`,
          { method: "GET" }
        );
        this.setMembers(members);
      } catch (error: any) {
        this.error =
          error.data.message || "An error occurred while fetching member";
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async invite(users: FormData): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        users.append("action", "invite_member");
        users.append("token", localStorage.sessionId);
        await $fetch(`/api/member`, { method: "POST", body: users });
      } catch (error: any) {
        this.error =
          error.data.message || "An error occurred while inviting member";
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async delete(data: FormData): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        data.append('action', 'delete_member');
        data.append('token', localStorage.sessionId);
        await $fetch('/api/member', { method: 'DELETE', body: data });
      } catch (error: any) {
        this.error = error.data.message || 'An error occurred while deleting user';
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async activate(data: FormData): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        data.append('action', 'active_member');
        data.append('token', localStorage.sessionId);
        await $fetch('/api/member', { method: 'POST', body: data });
      } catch (error: any) {
        this.error = error.data.message || 'An error occurred while activating user';
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    activateMember(id: number) {
      const memberToUpdate = this.data.data.find(member => member.id === id);
      if (memberToUpdate) {
        memberToUpdate.active = true;
      }
    },
    deactivateMember(id: number) {
      const memberToUpdate = this.data.data.find(member => member.id === id);
      if (memberToUpdate) {
        memberToUpdate.active = false;
      }
    },
  },
});
