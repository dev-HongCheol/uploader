const fileUploader = {
  uploaderInput: null,
  uploaderListDiv: null,
  uploadFileMaxLenght: 3,
  // ** 뒤 숫자 > (1:KB, 2:MB , 3:GB ... )
  uploadFileMaxSize: 1024 ** 2 * 10,
  uploadFileDataTranster: null,
  /**
   * 화면이 모두 로드된 후 input의 .ma-uploader를 찾아 onchange 이벤트 바인딩
   * 1. 최대 업로드 가능 사이즈(uploadFileMaxSize) 체크 -> 초과할 경우 리스트 미출력
   * 2. 최대 업로드 파일 갯수(uploadFileMaxLenght) 체크
   * 3. 리스트 출력
   */
  bind: () => {
    window.addEventListener('DOMContentLoaded', () => {
      console.info(
        `fileUploader __ uploadFileMaxLenght : ${
          fileUploader.uploadFileMaxLenght
        } / uploadFileMaxSize : ${fileUploader.formatSize(
          fileUploader.uploadFileMaxSize,
        )}`,
      );
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

        fileUploader.uploadFileDataTranster = new DataTransfer();

        const isMaxFileSizeOver = fileUploader.uploadFileMaxSizeCheck();
        if (isMaxFileSizeOver) {
          alert(
            `업로드 최대 사이즈 ${fileUploader.formatSize(
              fileUploader.uploadFileMaxSize,
            )}를 초과하였습니다.`,
          );
          fileUploader.uploaderInput.value = null;
          fileUploader.showFileInfoList();
          return;
        }
        fileUploader.uploadFileMaxLengthCheck();
        fileUploader.showFileInfoList();
      });
    });
  },

  /* uploadFileMaxSizeCheck: () => {
    const uploadFiles = fileUploader.uploaderInput.files;
    const fileUploaderArr = Array.from(uploadFiles);
    fileUploader.uploadFileDataTranster.items.clear();
    let totalUploadSize = 0;

    fileUploaderArr.some((file) => {
      totalUploadSize += file.size;
      if (totalUploadSize > fileUploader.uploadFileMaxSize) {
        alert(
          `업로드 최대 사이즈(${fileUploader.formatSize(
            fileUploader.uploadFileMaxSize,
          )})를 초과하여 일부파일만 업로드 됩니다.`,
        );
        return true;
      }
      fileUploader.uploadFileDataTranster.items.add(file);
    });

    fileUploader.uploaderInput.files = fileUploader.uploadFileDataTranster.files;
  }, */

  /**
   * 업로드 파일 사이즈 체크 함수
   * @returns 파일의 전체 사이즈가 제한 사이즈(uploadFileMaxSize) 오버 여부
   */
  uploadFileMaxSizeCheck: () => {
    const uploadFiles = fileUploader.uploaderInput.files;
    const fileUploaderArr = Array.from(uploadFiles);
    fileUploader.uploadFileDataTranster.items.clear();
    let totalUploadSize = 0;

    const isMaxFileSizeOver = fileUploaderArr.some((file) => {
      totalUploadSize += file.size;
      if (totalUploadSize > fileUploader.uploadFileMaxSize) {
        return true;
      }
      fileUploader.uploadFileDataTranster.items.add(file);
    });

    fileUploader.uploaderInput.files = fileUploader.uploadFileDataTranster.files;
    return isMaxFileSizeOver;
  },

  /**
   * 선택한 파일의 수가 최대 파일 수(uploadFileMaxLenght)를 넘을 경우 최대 파일 수 만큼만 선택되어 업로드 됨
   */
  uploadFileMaxLengthCheck: () => {
    const uploadFiles = fileUploader.uploaderInput.files;
    const fileUploaderArr = Array.from(uploadFiles);
    fileUploader.uploadFileDataTranster.items.clear();

    if (fileUploaderArr.length > fileUploader.uploadFileMaxLenght) {
      fileUploaderArr.some((file, index) => {
        if (index === fileUploader.uploadFileMaxLenght) {
          alert(
            `업로드 최대 개수 ${fileUploader.uploadFileMaxLenght}개를 초과하여 ${fileUploaderArr.length}개 중 ${fileUploader.uploadFileMaxLenght}개만 업로드 됩니다.`,
          );
          return true;
        }
        fileUploader.uploadFileDataTranster.items.add(file);
      });
    } else {
      fileUploaderArr.forEach((file) => {
        fileUploader.uploadFileDataTranster.items.add(file);
      });
    }

    fileUploader.uploaderInput.files = fileUploader.uploadFileDataTranster.files;
  },

  /**
   * 업로드 파일정보 리스트 초기화 및 정보 출력
   */
  showFileInfoList: () => {
    const maFileInfos = fileUploader.uploaderListDiv.querySelectorAll('.ma-file-info');
    maFileInfos.forEach((maFileInfo) => maFileInfo.remove());

    const uploadFiles = fileUploader.uploaderInput.files;
    for (let fIndex = 0; fIndex < uploadFiles.length; fIndex += 1) {
      const file = uploadFiles[fIndex];
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

    const fileUploaderArr = Array.from(fileUploader.uploadFileDataTranster.files);
    fileUploader.uploadFileDataTranster.items.clear();
    fileUploaderArr
      .filter((_file, index) => index !== fIndex)
      .forEach((file) => {
        fileUploader.uploadFileDataTranster.items.add(file);
      });
    fileUploader.uploaderInput.files = fileUploader.uploadFileDataTranster.files;
    fileUploader.showFileInfoList();
  },

  /**
   * 파일 사이즈에 따른 단위 출력 포멧터
   */
  formatSize: (length) => {
    let i = 0;
    const type = ['B', 'КB', 'МB', 'GB', 'ТB', 'PB'];
    while ((length / 1000) | 0 && i < type.length - 1) {
      length /= 1024;
      i++;
    }
    return length.toFixed(2) + ' ' + type[i];
  },
};

fileUploader.bind();
