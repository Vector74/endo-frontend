import { Translate } from "../core_utils/utils.js";

export default function  ExportCSV (data, fileName ) {
    const header = (data.length > 0 ? Object.keys(data[0]).map((key) => { return Translate(key); }, []) : []);
    const csvString = [
      header,
      ...data.map(item => [
        Object.keys(item).map((key) => { 
            return item[key];
        })
    ]) 
    ]
    .map(row => row.join(","))
    .join("\n");

    const blob = new Blob([csvString], { type: 'text/csv' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'download.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

};

