import { useEffect, useMemo, useState } from "react";
import { Trash2, UserCheck, Users, UserX } from "lucide-react";
import { useAdminDispatch, useAdminSelector } from "../store/hooks";
import {
  changeAdminUserAccess,
  deleteAdminUserAccount,
  loadAdminUsers,
  selectAdminUsers,
} from "../store/slices/adminUsersSlice";
import { AdminTableLoadingRow } from "../components/AdminTableLoadingRow";
import { AdminEmptyState, AdminErrorAlert, AdminPageHeader, AdminSearch, AdminStatusBadge, formatDateTime } from "../components/AdminUi";
import { Button } from "../../web/components/ui/button";
import { Badge } from "../../web/components/ui/badge";
import { Spinner } from "../../web/components/ui/spinner";

export function AdminUsersPage() {
  const dispatch = useAdminDispatch();
  const users = useAdminSelector(selectAdminUsers);
  const currentAdminUid = useAdminSelector((state) => state.adminAuth.user?.uid);
  const { isLoading, isUpdating, error } = useAdminSelector((state) => state.adminUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && users.length === 0) {
      void dispatch(loadAdminUsers({ limit: 50 }));
    }
  }, [dispatch, isLoading, users.length]);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;

    return users.filter((user) =>
      [user.uid, user.email, user.displayName, user.role, user.disabled ? "disabled" : "enabled"]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [users, searchQuery]);
  const showSearchControls = isLoading || users.length > 0 || searchQuery.trim().length > 0;

  const handleAccessChange = async (uid: string, disabled: boolean) => {
    const actionKey = `${uid}:${disabled ? "disable" : "enable"}`;
    setPendingActionKey(actionKey);
    try {
      await dispatch(changeAdminUserAccess({ uid, disabled })).unwrap();
    } finally {
      setPendingActionKey(null);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    const shouldDelete = window.confirm(
      "Permanently delete this user? This removes Auth account and related Firestore/Storage data.",
    );
    if (!shouldDelete) return;

    const actionKey = `${uid}:delete`;
    setPendingActionKey(actionKey);
    try {
      await dispatch(deleteAdminUserAccount({ uid })).unwrap();
    } finally {
      setPendingActionKey(null);
    }
  };

  return (
    <section>
      <AdminPageHeader
        title="Users Access"
        description="Manage sign-in state or permanently delete user accounts and related data."
        count={filteredUsers.length}
        countLabel="users"
        isRefreshing={isLoading}
        onRefresh={() => void dispatch(loadAdminUsers({ limit: 50 }))}
      />
      {showSearchControls ? (
        <AdminSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search by uid, email, name, role..." />
      ) : null}
      {error ? <AdminErrorAlert message={error} /> : null}

      {!isLoading && filteredUsers.length === 0 ? (
        <div className="mt-5 rounded-xl border border-border bg-card">
          <AdminEmptyState
            icon={Users}
            title="No users found"
            subtitle="No users match your search query. Try a broader term or refresh the user list."
            className="py-10"
          />
        </div>
      ) : (
        <div className="mt-5">
          <div className="space-y-3 md:hidden">
            {isLoading && users.length === 0 ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card p-6">
                <Spinner className="h-5 w-5" />
                <span className="sr-only">Loading users</span>
              </div>
            ) : null}
            {filteredUsers.map((user) => (
              <article key={user.uid} className="rounded-xl border border-border bg-card p-4">
                <p className="font-mono text-xs text-muted-foreground break-all">{user.uid}</p>
                <p className="mt-2 text-sm break-all">{user.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline" className="capitalize">{user.role}</Badge>
                  <AdminStatusBadge value={user.disabled ? "disabled" : "enabled"} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Created: {formatDateTime(user.createdAt)}</p>
                <div className="mt-3">
                  {user.uid === currentAdminUid ? (
                    <Badge variant="outline" className="border-0 bg-red-500/10 text-xs text-red-400">
                      Current account
                    </Badge>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        title={user.disabled ? "Enable account" : "Disable account"}
                        aria-label={user.disabled ? "Enable account" : "Disable account"}
                        disabled={isUpdating}
                        onClick={() => void handleAccessChange(user.uid, !user.disabled)}
                      >
                        {pendingActionKey === `${user.uid}:${user.disabled ? "enable" : "disable"}` ? (
                          <Spinner className="h-4 w-4" />
                        ) : user.disabled ? (
                          <UserCheck className="h-4 w-4" />
                        ) : (
                          <UserX className="h-4 w-4" />
                        )}
                        {user.disabled ? "Enable" : "Disable"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        title="Delete account"
                        aria-label="Delete account"
                        disabled={isUpdating}
                        onClick={() => void handleDeleteUser(user.uid)}
                      >
                        {pendingActionKey === `${user.uid}:delete` ? (
                          <Spinner className="h-4 w-4" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-accent/30 text-left text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">User</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Access</th>
                  <th className="hidden px-3 py-2 md:table-cell">Created</th>
                  <th className="px-3 py-2" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {isLoading && users.length === 0 && <AdminTableLoadingRow colSpan={6} label="Loading users..." />}
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="border-t border-border">
                    <td className="max-w-[220px] px-3 py-2 font-mono text-xs break-all">{user.uid}</td>
                    <td className="max-w-[220px] px-3 py-2 break-all">{user.email}</td>
                    <td className="px-3 py-2">
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <AdminStatusBadge value={user.disabled ? "disabled" : "enabled"} />
                    </td>
                    <td className="hidden px-3 py-2 text-xs text-muted-foreground md:table-cell">{formatDateTime(user.createdAt)}</td>
                    <td className="px-3 py-2">
                      {user.uid === currentAdminUid ? (
                        <Badge variant="outline" className="border-0 bg-red-500/10 text-xs text-red-400">
                          Current account
                        </Badge>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            title={user.disabled ? "Enable account" : "Disable account"}
                            aria-label={user.disabled ? "Enable account" : "Disable account"}
                            disabled={isUpdating}
                            onClick={() => void handleAccessChange(user.uid, !user.disabled)}
                          >
                            {pendingActionKey === `${user.uid}:${user.disabled ? "enable" : "disable"}` ? (
                              <Spinner className="h-4 w-4" />
                            ) : user.disabled ? (
                              <UserCheck className="h-4 w-4" />
                            ) : (
                              <UserX className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            title="Delete account"
                            aria-label="Delete account"
                            disabled={isUpdating}
                            onClick={() => void handleDeleteUser(user.uid)}
                          >
                            {pendingActionKey === `${user.uid}:delete` ? (
                              <Spinner className="h-4 w-4" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isUpdating ? (
        <Badge variant="outline" className="mt-3 px-2.5 py-1 text-xs text-muted-foreground">
          Applying user action...
        </Badge>
      ) : null}
    </section>
  );
}
