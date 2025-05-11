$(document).ready(function() {
    const dummyFiles = [
        { name: "Project Alpha", type: "folder", modified: "Oct 26, 2023", size: "--", id: "folder1", shareId: "AbCdEf1234" },
        { name: "Annual_Report.pdf", type: "file-pdf", modified: "Oct 25, 2023", size: "2.1 MB", id: "file1", shareId: "GhIjKl5678" },
        { name: "Vacation_Photo_01.jpg", type: "file-image", modified: "Oct 22, 2023", size: "4.5 MB", id: "file2", shareId: "MnOpQr9012" },
        { name: "Meeting_Notes.docx", type: "file-word", modified: "Oct 20, 2023", size: "128 KB", id: "file3", shareId: "StUvWx3456" },
    ];

    const fileList = $('#fileList');

    function renderFiles() {
        fileList.empty(); // Clear existing files
        dummyFiles.forEach(file => {
            let iconClass = 'fas fa-file'; // Default icon
            if (file.type === 'folder') iconClass = 'fas fa-folder text-warning';
            else if (file.type === 'file-pdf') iconClass = 'fas fa-file-pdf text-danger';
            else if (file.type === 'file-image') iconClass = 'fas fa-file-image text-info';
            else if (file.type === 'file-word') iconClass = 'fas fa-file-word text-primary';
            
            const row = `
                <tr>
                    <td><i class="${iconClass} mr-2"></i> ${file.name}</td>
                    <td>${file.modified}</td>
                    <td>${file.size}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-info share-btn" data-shareid="${file.shareId}" title="Share">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary download-btn" title="Download" data-name="${file.name}">
                            <i class="fas fa-download"></i>
                        </button>
                         <button class="btn btn-sm btn-outline-danger delete-btn" title="Delete" data-id="${file.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>`;
            fileList.append(row);
        });
    }

    renderFiles(); // Initial render

    // Fake Upload
    $('#uploadFile').on('change', function(e) {
        const fileName = e.target.files[0] ? e.target.files[0].name : "New_File.zip";
        // Simulate upload progress (optional visual)
        alert(`"${fileName}" selected. Simulating upload...`);
        // Add to dummy files and re-render
        dummyFiles.unshift({ // Add to top
            name: fileName,
            type: 'file', // determine by extension if you want
            modified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            size: (Math.random() * 10).toFixed(1) + " MB",
            id: 'file' + Date.now(),
            shareId: Math.random().toString(36).substring(2, 10)
        });
        renderFiles();
        $(this).val(''); // Reset file input
    });

    // Fake New Folder
    $('#newFolderBtn').on('click', function() {
        const folderName = prompt("Enter folder name:", "New Folder");
        if (folderName) {
            dummyFiles.unshift({
                name: folderName,
                type: 'folder',
                modified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                size: '--',
                id: 'folder' + Date.now(),
                shareId: Math.random().toString(36).substring(2, 10)
            });
            renderFiles();
        }
    });

    // Share button
    $(document).on('click', '.share-btn', function() {
        const shareId = $(this).data('shareid');
        const shareableLink = `${window.location.origin}${window.location.pathname.replace('dashboard.html', '')}share/${shareId}`;
        $('#shareLinkInput').val(shareableLink);
        $('#shareModal').modal('show');
    });
    
    // Copy share link
    $('#copyLinkBtn').on('click', function() {
        const linkInput = $('#shareLinkInput');
        linkInput.select();
        document.execCommand('copy');
        // Maybe show a "Copied!" message
        $(this).text('Copied!').prop('disabled', true);
        setTimeout(() => {
            $(this).text('Copy Link').prop('disabled', false);
            $('#shareModal').modal('hide');
        }, 1500);
    });

    // Fake Download
    $(document).on('click', '.download-btn', function() {
        const fileName = $(this).data('name');
        alert(`Simulating download for: ${fileName}\nIn a real scenario, this would trigger a file download.`);
        // To make it more real, you could have a dummy file in your repo
        // window.location.href = 'assets/dummy_download.txt';
    });
    
    // Fake Delete
    $(document).on('click', '.delete-btn', function() {
        const fileId = $(this).data('id');
        if (confirm("Are you sure you want to move this item to trash? (This is a simulation)")) {
            const index = dummyFiles.findIndex(file => file.id === fileId);
            if (index > -1) {
                dummyFiles.splice(index, 1);
                renderFiles();
            }
        }
    });
});