import Link from 'next/link';

export default function AdminUsers() {
  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-bold">User Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">person_add</span>
            <span className="text-sm font-bold hidden sm:block">Add User</span>
          </button>
        </div>
      </header>
      
      <div className="p-8 space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-10rem)]">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input type="text" placeholder="Search users by name, email, or ID..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-primary focus:border-primary" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2">
                <option>All Roles</option>
                <option>Admin</option>
                <option>Instructor</option>
                <option>Student</option>
              </select>
              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Login</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  { name: 'Alex Rivera', email: 'alex.rivera@example.com', role: 'Student', status: 'Active', lastLogin: '2 mins ago', progress: 65, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8wAOv6f0ddC35k7SIPGla2M_3OmmhpQbPUHcJ_tFDuB58hQtf_KVGGzEwjqdKrjtG9w1J3yHE4Jc8Wk4fb_bbTvudPTDfMxj-9A8RiAsFyR_ogCS9YCln_D-UVltXr-BWIqF4xNEENqCKaoV9pubITldvQfC4jsFLEDLc7bA4pVSMiKvJLDjfM60Vp8TMQwDHMLfHcBNrchW0VhNlHhxXM6BFxM4O4ir7reoG2vXK7pnqtm7wISxjZ1u7oGNmumHsbipJYZpq5MhY' },
                  { name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Instructor', status: 'Active', lastLogin: '1 hour ago', progress: 100, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWZwiftgu4AMhbzaLfq4zDAip5gXzPW3qNmE8lWEZBNFHeHJhf5eJdHmOsjI8fwVquHEZxhvGcChIKIetJDH6r3_k1r0ulDfMvglis8QVkCpB_lhPxI2JqSSczOh4QEoPb6puB6f26-TS7aiVkoXWVV5ejvWJSRUc9yePGjKZfAj9cH8qiTu0D41JZefEr20nyCHPTg8w4afgS57EhFq1Xa0mAzpEU2-At_8f1x9C0E090pTq1QEBIz8fPOH1NOt5_NBScrdI66iit' },
                  { name: 'Michael Johnson', email: 'mjohnson@example.com', role: 'Student', status: 'Inactive', lastLogin: '2 weeks ago', progress: 12, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWdblADvkaffefr_QT-n86mCM8htbLs9w9ujQ1TnBUmsOEj_Jk4kIH-4yqDVST6t6kq-x46uIe3rmlh_tueJkDhWdh48ud5zVdlDibRySMKp-HO0qu41Fsyy_Fa48Ng1qNedSP0U9YrE1dmfuaEqrIzt4LCTtTZElGJZwKkSqn8dRcfmkYjla7dVpKxJiBpamDh_5f3P5d0pg9u_nMSBLV5fHCR0jjYDTFHWOos9Z_JVQIYBt0MIk7kkHzsCOszP1dtIwX5oOwlF8J' },
                  { name: 'Emily Davis', email: 'edavis@example.com', role: 'Admin', status: 'Active', lastLogin: 'Just now', progress: 100, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvpPvG3CR4cqnxOn9gGEjpIZ_-qsGvTMDY4s5befRK81PA2lZITvJtjk_W6JuvyXnx-9WhBqpKBnMcmhxjiWEgnVH2LXeQSB3oGGpYRNVa-d4pieEHo5bMmI5FH-EY58jtbhlmA_a_P48Zj3rOqp-1yLn5fag96KLeByzMo6BHhcPJi2DB3Ijq7p42s7qYyDrCLp3nMFGQaiBYjk1BA5s4ArEAiwda9JGlSWJyk36GKFvy3vyQiYIPYU6RN-xvebJt7tjnYnzhdqWD' },
                  { name: 'David Wilson', email: 'dwilson@example.com', role: 'Student', status: 'Suspended', lastLogin: '1 month ago', progress: 45, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-0TEJ-hmIA8Dgtn0Wxvav-KNn9dAwEtVsZ_0qSyZp88u0Mg4hDaVHHPUx7eogFHC6xy6T7yVviUtMdlfzfWDoUY7HCXTq6ehU9jjDXHY2OB1Mp0d4FhAhCxxqM2S30XM1_c16Idkmh9zk1vBQWuOsqOLHOUotVxIO3EpUuXQCZIIaMRwKLKj1eyoCZx-rY_37LQyp_dWNL_hZUTMmpgNDk9_mIQzQcElJ7HdkhDSk6x9QiCYQgrlZMNVdgfsr1JBvtUzypH8-YWuQ' },
                ].map((user, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.role === 'Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        user.role === 'Instructor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        user.status === 'Inactive' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">{user.lastLogin}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 max-w-[100px]">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${user.progress}%` }}></div>
                        </div>
                        <span className="text-xs font-bold">{user.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 flex-shrink-0">
            <span className="text-sm text-slate-500">Showing 1 to 5 of 12,450 users</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-400 cursor-not-allowed">Prev</button>
              <button className="px-3 py-1 border border-primary bg-primary text-white rounded font-medium">1</button>
              <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">2</button>
              <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">3</button>
              <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
