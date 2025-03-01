import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { CircleAlert, Check, FileSpreadsheet, Upload, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExcelImportProps {
  onImportData: (data: any[]) => void;
  headers: string[];
  requiredFields: string[];
  templateHeaders: Record<string, string>;
}

const ExcelImport = ({ onImportData, headers, requiredFields, templateHeaders }: ExcelImportProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processExcelFile = (file: File) => {
    setError(null);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Validate data structure
        if (jsonData.length === 0) {
          setError('File Excel kosong atau tidak memiliki data.');
          return;
        }
        
        // Check for required fields
        const firstRow = jsonData[0] as Record<string, any>;
        const missingFields = requiredFields.filter(field => 
          !Object.keys(firstRow).some(key => 
            key.toLowerCase() === field.toLowerCase() || 
            (templateHeaders[field] && key.toLowerCase() === templateHeaders[field].toLowerCase())
          )
        );
        
        if (missingFields.length > 0) {
          setError(`Kolom berikut tidak ditemukan: ${missingFields.join(', ')}`);
          return;
        }
        
        // Map data to expected format
        const mappedData = jsonData.map((row: any) => {
          const mappedRow: Record<string, any> = {};
          
          // Map fields based on either exact match or template headers
          for (const field of headers) {
            // Try direct match
            if (row[field] !== undefined) {
              mappedRow[field] = row[field];
              continue;
            }
            
            // Try template header match
            const templateHeader = templateHeaders[field];
            if (templateHeader && row[templateHeader] !== undefined) {
              mappedRow[field] = row[templateHeader];
              continue;
            }
            
            // Try case-insensitive match
            const caseInsensitiveKey = Object.keys(row).find(key => 
              key.toLowerCase() === field.toLowerCase() || 
              (templateHeader && key.toLowerCase() === templateHeader.toLowerCase())
            );
            
            if (caseInsensitiveKey) {
              mappedRow[field] = row[caseInsensitiveKey];
            } else {
              mappedRow[field] = '';
            }
          }
          
          return mappedRow;
        });
        
        setPreviewData(mappedData);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        setError('Terjadi kesalahan saat memproses file Excel.');
      }
    };
    
    reader.onerror = () => {
      setError('Terjadi kesalahan saat membaca file.');
    };
    
    reader.readAsBinaryString(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          droppedFile.name.endsWith('.xlsx')) {
        setFile(droppedFile);
        processExcelFile(droppedFile);
      } else {
        setError('Hanya file Excel (.xlsx) yang diperbolehkan.');
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile);
        processExcelFile(selectedFile);
      } else {
        setError('Hanya file Excel (.xlsx) yang diperbolehkan.');
      }
    }
  };

  const handleImport = () => {
    if (previewData.length > 0) {
      onImportData(previewData);
      // Reset after import
      setFile(null);
      setPreviewData([]);
    }
  };

  const downloadTemplate = () => {
    // Create template worksheet
    const ws = XLSX.utils.json_to_sheet([]);
    
    // Add header row
    XLSX.utils.sheet_add_aoa(ws, [Object.values(templateHeaders)], { origin: 'A1' });
    
    // Create workbook and add the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    
    // Generate and download Excel file
    XLSX.writeFile(wb, 'template_import_siswa.xlsx');
  };

  const cancelImport = () => {
    setFile(null);
    setPreviewData([]);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {!file && (
        <div
          className={`border-2 border-dashed p-8 rounded-lg text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-emerald-500 bg-emerald-50' 
              : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".xlsx"
            onChange={handleFileChange}
          />
          <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Klik atau jatuhkan file Excel (.xlsx) di sini
          </p>
          <p className="text-xs text-gray-500">
            Format: Excel file dengan kolom {Object.values(templateHeaders).join(', ')}
          </p>
          <button
            type="button"
            className="mt-4 inline-flex items-center px-3 py-1 border border-emerald-500 text-xs font-medium rounded-md text-emerald-600 bg-white hover:bg-emerald-50"
            onClick={(e) => {
              e.stopPropagation();
              downloadTemplate();
            }}
          >
            Download Template
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
          <CircleAlert className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {file && !error && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
            <div className="flex items-center">
              <FileSpreadsheet className="h-5 w-5 text-emerald-500 mr-2" />
              <span className="text-sm font-medium">{file.name}</span>
            </div>
            <button
              onClick={cancelImport}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {previewData.length > 0 && (
            <div>
              <div className="px-4 py-3 border-b">
                <h3 className="text-sm font-medium text-gray-700">Preview Data ({previewData.length} records)</h3>
              </div>
              <div className="overflow-x-auto max-h-60">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {headers.map((header) => (
                        <th 
                          key={header}
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        {headers.map((header) => (
                          <td key={`${index}-${header}`} className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                            {row[header] || ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {previewData.length > 5 && (
                      <tr>
                        <td colSpan={headers.length} className="px-6 py-2 text-sm text-gray-500 text-center">
                          ...and {previewData.length - 5} more rows
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t flex justify-end">
                <button
                  onClick={handleImport}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <Check className="h-4 w-4 mr-1.5" />
                  Import {previewData.length} Data
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelImport;
