import { MissingPersonInfo } from "@/app/interfaces/MissingPersonInfo";

export default function OcurrencesCard({
  id,
  informacao,
  data,
  anexos,
}: MissingPersonInfo) {
  return (
    <div
      key={id}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 w-[300px] flex flex-col overflow-hidden"
    >
      <div className="mb-2">
        <h3 className="font-medium text-gray-800">Informações gerais:</h3>
        <p className="text-gray-600 line-clamp-3">{informacao}</p>
      </div>

      {data && (
        <div className="mb-2">
          <h3 className="font-medium text-gray-800">Data:</h3>
          <p className="text-gray-600">{data}</p>
        </div>
      )}

      {anexos && anexos.length > 0 && (
        <div className="mb-2">
          <h3 className="font-medium text-gray-800">Anexos:</h3>
          <div className="overflow-y-auto max-h-[100px] pr-1">
            {anexos.map((attachment, index) => (
              <a
                key={attachment}
                href={attachment}
                target="_blank"
                className="block text-blue-500 hover:text-blue-700 transition-colors mb-1"
              >
                <li>Anexo {index + 1}</li>
              </a>
            ))}
          </div>
        </div>
      )}

      {anexos.length <= 0 && (
        <p className="text-sm text-gray-500 italic mt-auto">
          Esta ocorrência não possui anexos.
        </p>
      )}
    </div>
  );
}
