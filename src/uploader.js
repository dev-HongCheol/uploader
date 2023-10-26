const fileUploader = {
  uploaderInput: null,
  uploaderListDiv: null,
  uploadFiles: null,
  /**
   * 화면이 모두 로드된 후 input의 .ma-uploader를 찾아 onchange 이벤트 바인딩 및
   * 업로드 파일정보 리스트 출력함수 showFileInfoList 호출
   */
  bind: () => {
    window.addEventListener('DOMContentLoaded', () => {
      fileUploader.uploaderInput = document.querySelector('.ma-uploader');
      if (!fileUploader.uploaderInput) {
        console.error('업로더 input .ma-uploader가 존재하지 않습니다.');
        return;
      }

      fileUploader.uploaderInput.addEventListener('change', () => {
        fileUploader.uploaderListDiv = document.querySelector(
          '.ma-uploader-list-wrapper',
        );
        if (!fileUploader.uploaderListDiv) {
          console.error(
            '리스트를 표현하는 .ma-uploader-list-wrapper div가 존재하지 않습니다.',
          );
          return;
        }
        fileUploader.showFileInfoList();
      });
    });
  },

  /**
   * 업로드 파일정보 리스트 초기화 및 정보 출력
   */
  showFileInfoList: () => {
    fileUploader.uploadFiles = fileUploader.uploaderInput.files;
    const maFileInfos = fileUploader.uploaderListDiv.querySelectorAll('.ma-file-info');
    maFileInfos.forEach((maFileInfo) => maFileInfo.remove());

    for (let fIndex = 0; fIndex < fileUploader.uploadFiles.length; fIndex += 1) {
      const file = fileUploader.uploadFiles[fIndex];
      const fileListHtml = `
          <div class="ma-file-info" id="maUploadList-${fIndex}">
              <div class="file-no">${fIndex + 1}</div>
              <div class="file-name">${file.name}</div>
              <div class="file-szie">${fileUploader.formatSize(file.size)}</div>
              <div class="file-icon">
                  <span class="cross-1px" 
                      onclick="fileUploader.removeFile(${fIndex}, '${file.name}')">
                  </span>
              </div>
          </div>
        `;
      fileUploader.uploaderListDiv.insertAdjacentHTML('beforeend', fileListHtml);
    }
  },

  /**
   * 선택한 업로드 파일 리스트 제거
   */
  removeFile: (fIndex, fileName) => {
    console.log(fIndex);
    const isDelete = confirm(`파일 ${fileName}을 삭제 하시겠습니까?`);
    if (!isDelete) {
      return;
    }
    const dataTranster = new DataTransfer();

    Array.from(fileUploader.uploadFiles)
      .filter((file, index) => index !== fIndex)
      .forEach((file) => {
        dataTranster.items.add(file);
      });
    fileUploader.uploaderInput.files = dataTranster.files;
    fileUploader.showFileInfoList();
  },

  /**
   * 파일 사이즈에 따른 단위 출력 포멧터
   */
  formatSize: (length) => {
    let i = 0;
    const type = ['b', 'Кb', 'Мb', 'Gb', 'Тb', 'Pb'];
    while ((length / 1000) | 0 && i < type.length - 1) {
      length /= 1024;
      i++;
    }
    return length.toFixed(2) + ' ' + type[i];
  },
};

fileUploader.bind();
