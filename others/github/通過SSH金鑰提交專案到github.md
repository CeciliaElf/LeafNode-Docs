 好的，這是一份將您提供的指南轉換為詳細的 Markdown 格式筆記，並使用台灣繁體中文的內容：

---

# 使用 SSH 將本地專案提交至 GitHub 的詳細步驟

這份筆記將引導您如何透過 SSH 協議，將本地的 Git 專案提交（Push）到 GitHub 儲存庫。

在開始之前，請確保您已經完成以下**前置條件**：

*   您的電腦已安裝 Git。
*   您已生成 SSH 密鑰對（公鑰和私鑰），並知道私鑰的位置（通常在 `~/.ssh/id_rsa` 或 `~/.ssh/id_ed25519`）。
*   **最重要的一點：** 您已將您的 SSH 公鑰新增到您的 GitHub 帳戶設定中。如果您不確定如何操作，可以參考 GitHub 的官方文件（搜尋 "Adding a new SSH key to your GitHub account"）。這是使用 SSH 提交的必要前提。

---

## 步驟 1：在 GitHub 上建立一個新的空儲存庫

1.  開啟您的網頁瀏覽器，造訪 [https://github.com/](https://github.com/) 並登入您的 GitHub 帳戶。
2.  在頁面右上角，點擊加號（`+`）圖示，然後選擇 **New repository** (新儲存庫)。
3.  在 "Repository name" 欄位中，輸入您想要為專案命名的儲存庫名稱（例如：`my-awesome-project`）。
4.  （可選）在 "Description" 欄位中，為您的儲存庫新增一個簡要描述。
5.  選擇儲存庫的公開性：**Public** (公開) 或 **Private** (私人)。
6.  **非常重要：** 在 "Initialize this repository with:" 部分，**請勿勾選** "Add a README file"、"Add .gitignore" 或 "Choose a license"。我們需要建立一個完全空的儲存庫，以便將本地專案推送上去。
7.  點擊綠色的 **Create repository** (建立儲存庫) 按鈕。

## 步驟 2：取得新建立儲存庫的 SSH URL

1.  儲存庫建立成功後，您會看到一個頁面，上面顯示了一些關於如何將現有專案推送至此儲存庫的說明。
2.  找到頁面上的 **"SSH"** 選項卡，點擊它。
3.  複製 SSH URL。它通常以 `git@github.com:` 開頭，格式類似於 `git@github.com:您的GitHub使用者名稱/您的儲存庫名稱.git`。
    *   **範例：** `git@github.com:your-username/my-awesome-project.git`

## 步驟 3：開啟終端機或命令列工具，並進入您的本地專案目錄

1.  開啟您電腦上的終端機（macOS/Linux）或命令提示字元/PowerShell（Windows）。
2.  使用 `cd` 命令導航到您的本地專案資料夾。
    *   **指令：**
        ```bash
        cd /path/to/your/local/project
        ```
    *   請將 `/path/to/your/local/project` 替換為您實際的專案路徑。

## 步驟 4：在本地專案目錄中初始化 Git 儲存庫（如果尚未初始化）

*   **如果您的專案已經是 Git 儲存庫了**（即專案資料夾中已經有一個隱藏的 `.git` 資料夾），請跳過此步驟。

*   **如果您的專案還不是 Git 儲存庫**，請在專案根目錄中執行以下命令來初始化一個新的 Git 儲存庫：
    *   **指令：**
        ```bash
        git init
        ```
    *   這會在您的專案資料夾中建立一個隱藏的 `.git` 子目錄，用於儲存 Git 的所有版本控制資訊。

## 步驟 5：將 GitHub 儲存庫新增為本地儲存庫的遠端來源

現在，我們需要告訴本地 Git 儲存庫它應該連接到哪個遠端 GitHub 儲存庫。

1.  在您的本地專案目錄中，執行以下命令，將**步驟 2** 中複製的 SSH URL 新增為名為 `origin` 的遠端來源：
    *   **指令：**
        ```bash
        git remote add origin git@github.com:您的GitHub使用者名稱/您的儲存庫名稱.git
        ```
    *   請將 `git@github.com:您的GitHub使用者名稱/您的儲存庫名稱.git` 替換為您在**步驟 2** 中複製的實際 SSH URL。
    *   `origin` 是遠端儲存庫的預設名稱，您可以選擇其他名稱，但 `origin` 是慣例。

2.  （可選）您可以執行以下命令來驗證遠端來源是否已成功新增：
    *   **指令：**
        ```bash
        git remote -v
        ```
    *   您應該會看到類似這樣的輸出，顯示 `origin` 的 fetch 和 push URL：
        ```
        origin  git@github.com:your-username/my-awesome-project.git (fetch)
        origin  git@github.com:your-username/my-awesome-project.git (push)
        ```

## 步驟 6：將專案檔案新增到 Git 暫存區並提交

1.  將您專案中的所有檔案新增到 Git 的暫存區，準備進行提交：
    *   **指令：**
        ```bash
        git add .
        ```
    *   這裡的 `.` 表示目前目錄下的所有檔案（包括子目錄中的檔案）。如果您只想新增特定檔案，可以將 `.` 替換為檔案名或目錄名。

2.  提交暫存區中的檔案到本地儲存庫：
    *   **指令：**
        ```bash
        git commit -m "Initial commit of the project"
        ```
    *   `-m` 後面跟著的是本次提交的簡短描述資訊。請根據實際情況修改提交訊息。

## 步驟 7：將本地提交推送至 GitHub 儲存庫

現在，是時候將您的本地程式碼上傳到 GitHub 了。

1.  執行以下命令將本地儲存庫的 `main` 分支（或 `master` 分支，取決於您的 Git 版本和配置）推送到名為 `origin` 的遠端儲存庫：
    *   **指令：**
        ```bash
        git push -u origin master
        ```
    *   `git push`: 執行推送操作。
    *   `-u`: 這是一個非常有用的選項。它會將本地的 `main` 分支與遠端的 `origin/main` 分支關聯起來（設定為上游）。這樣，以後您在 `main` 分支上執行 `git push` 或 `git pull` 時，就不需要再指定 `origin main` 了。
    *   `origin`: 指定要推送到的遠端儲存庫名稱（我們在**步驟 5** 中設定的）。
    *   `main`: 指定要推送的本地分支名稱。**注意：** GitHub 新建立的儲存庫預設分支通常是 `main`。如果您的本地預設分支是 `master`，或者您想推送其他分支，請將 `main` 替換為相應的分支名稱（例如 `master`）。您可以使用 `git branch` 命令查看本地分支。

2.  如果這是您第一次透過 SSH 連接到 GitHub，您可能會看到一個提示，詢問您是否確定要繼續連接（關於主機的真實性）。輸入 `yes` 並按下 Enter 鍵即可。

3.  如果您為 SSH 密鑰設定了密碼（passphrase），系統可能會提示您輸入密碼。輸入您的 SSH 密鑰密碼並按下 Enter 鍵。

如果一切順利，您會看到一些輸出，表明物件正在被打包和上傳。完成後，您的專案程式碼就成功推送到 GitHub 儲存庫了！

## 步驟 8：在 GitHub 上驗證

1.  回到您在 GitHub 上建立的儲存庫頁面（重新整理頁面）。
2.  您應該能看到您剛剛推送的專案檔案和提交歷史。

---

## 總結

整個將本地專案透過 SSH 提交至 GitHub 的核心步驟是：

1.  在 GitHub 建立一個**空的**儲存庫。
2.  取得該儲存庫的 **SSH URL**。
3.  在本地專案目錄中**初始化 Git**（如果尚未）。
4.  將 GitHub 儲存庫的 SSH URL 新增為本地儲存庫的**遠端來源**。
5.  **新增並提交**本地檔案至本地儲存庫。
6.  使用 `git push` 命令將本地提交**推送**到遠端 GitHub 儲存庫，Git 會自動使用 SSH 協議。

希望這個詳細的步驟對您有幫助！如果您在任何一步遇到了問題，請隨時告訴我，我會盡力協助您。感謝！