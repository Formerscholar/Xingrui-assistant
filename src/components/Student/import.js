// 库
import papa from "papaparse";
import xlsx from "xlsx";
export function csvImport(file) {
  return new Promise((resolve, reject) => {
    papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results, file) => {
        resolve(results);
      }
    });
  });
}
export function xlsxImport(file, url) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // 文件流转BinaryString
    const fixdata = data => {
      let [o, l, w] = ["", 0, 1024];
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    };
    // 处理获得头部数据
    const getHeaderRow = sheet => {
      const headers = [];
      const range = xlsx.utils.decode_range(sheet["!ref"]); // 表示所有单元格的范围

      let C;
      const R = range.s.r;

      for (C = range.s.c; C <= range.e.c; ++C) {
        var cell =
          sheet[
            xlsx.utils.encode_cell({
              c: C,
              r: R
            })
          ];

        var hdr = "UNKNOWN " + C;
        if (cell && cell.t) hdr = xlsx.utils.format_cell(cell);
        headers.push(hdr.trim());
      }
      return headers;
    };
    reader.onload = e => {
      const data = e.target.result;
      const fixedData = fixdata(data);
      const workbook = xlsx.read(btoa(fixedData), {
        type: "base64"
      });
      const firstSheetName = workbook.SheetNames[0]; // 获取Sheets中第一个Sheet的名字
      const worksheet = workbook.Sheets[firstSheetName]; // 获取第一个Sheet的数据
      const header = getHeaderRow(worksheet);
      /**
       * xlsx.utils.sheet_to_csv：生成CSV格式
       * xlsx.utils.sheet_to_txt：生成纯文本格式
       * xlsx.utils.sheet_to_html：生成HTML格式
       * xlsx.utils.sheet_to_json：输出JSON格式
       */

      const results = xlsx.utils.sheet_to_json(worksheet); // 常用导出类型
      resolve({
        header,
        results
      });
    };
    reader.readAsArrayBuffer(file);
  });
}
