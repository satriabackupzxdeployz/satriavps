const express = require('express');
const { NodeSSH } = require('node-ssh');
const router = express.Router();

const protectFilesMap = {
    "1": [
        { path: "/var/www/pterodactyl/app/Http/Controllers/Admin/Servers/ServerController.php", code: `<?php\nnamespace Pterodactyl\\Http\\Controllers\\Admin\\Servers;\nuse Illuminate\\View\\View;\nuse Illuminate\\Http\\Request;\nuse Illuminate\\Support\\Facades\\Auth;\nuse Pterodactyl\\Models\\Server;\nuse Pterodactyl\\Models\\User;\nuse Pterodactyl\\Models\\Nest;\nuse Pterodactyl\\Models\\Location;\nuse Spatie\\QueryBuilder\\QueryBuilder;\nuse Spatie\\QueryBuilder\\AllowedFilter;\nuse Pterodactyl\\Http\\Controllers\\Controller;\nuse Pterodactyl\\Models\\Filters\\AdminServerFilter;\nuse Illuminate\\Contracts\\View\\Factory as ViewFactory;\nclass ServerController extends Controller\n{\npublic function __construct(private ViewFactory $view){}\npublic function index(Request $request): View\n{\n$user = Auth::user();\n$query = Server::query()->with(['node', 'user', 'allocation'])->orderBy('id', 'asc');\nif ($user->id !== 1) {\n$query->where('owner_id', $user->id);\n}\n$servers = QueryBuilder::for($query)->allowedFilters([AllowedFilter::exact('owner_id'),AllowedFilter::custom('*', new AdminServerFilter()),])->paginate(config('pterodactyl.paginate.admin.servers'));\nreturn $this->view->make('admin.servers.index', ['servers' => $servers]);\n}\n}` }
    ],
    "2": [
        { path: "/var/www/pterodactyl/app/Http/Controllers/Admin/UserController.php", code: `<?php\nnamespace Pterodactyl\\Http\\Controllers\\Admin;\nuse Illuminate\\View\\View;\nuse Illuminate\\Http\\Request;\nuse Pterodactyl\\Models\\User;\nuse Spatie\\QueryBuilder\\QueryBuilder;\nuse Pterodactyl\\Exceptions\\DisplayException;\nuse Pterodactyl\\Http\\Controllers\\Controller;\nclass UserController extends Controller\n{\npublic function index(Request $request): View\n{\n$authUser = $request->user();\n$query = User::query();\nif ($authUser->id !== 1) {\n$query->where('id', $authUser->id);\n}\n$users = QueryBuilder::for($query)->paginate(50);\nreturn view('admin.users.index', ['users' => $users]);\n}\n}` }
    ],
    "3": [
        { path: "/var/www/pterodactyl/app/Http/Controllers/Admin/LocationController.php", code: `<?php\nnamespace Pterodactyl\\Http\\Controllers\\Admin;\nuse Illuminate\\View\\View;\nuse Illuminate\\Support\\Facades\\Auth;\nuse Pterodactyl\\Http\\Controllers\\Controller;\nclass LocationController extends Controller\n{\npublic function index(): View\n{\nif (Auth::user()->id !== 1) abort(403);\nreturn view('admin.locations.index');\n}\n}` }
    ]
};

router.post('/run', async (req, res) => {
    const { ip, pass, protectId, action } = req.body;
    const ssh = new NodeSSH();

    try {
        const mappedFiles = protectFilesMap[protectId];
        if (!mappedFiles && action === 'install') {
            throw new Error(`Data Protect ID ${protectId} belum dipetakan secara penuh di array Backend.`);
        }

        await ssh.connect({ host: ip, username: 'root', password: pass, port: 22, readyTimeout: 20000 });

        let logOut = `Target: Protect ${protectId} | Aksi: ${action}\n`;

        if (action === 'install') {
            for (let f of mappedFiles) {
                const command = `cat << 'EOF' > ${f.path}\n${f.code}\nEOF`;
                await ssh.execCommand(command);
                logOut += `[SUCCESS] Terpasang di: ${f.path}\n`;
            }
        } else if (action === 'uninstall') {
            logOut += `[INFO] Proses uninstall membutuhkan original Pterodactyl files. Menjalankan reinstalasi core file.\n`;
            await ssh.execCommand("cd /var/www/pterodactyl && curl -L https://github.com/pterodactyl/panel/releases/latest/download/panel.tar.gz | tar -xzv");
            logOut += `[SUCCESS] Core files di-restore.\n`;
        }

        ssh.dispose();
        res.json({ message: "Protect Action Selesai", log: logOut });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;