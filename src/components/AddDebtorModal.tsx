import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AddDebtorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const currencies = [
  { code: "PLN", symbol: "zł" },
];

const nationalities = [
  "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguan", "Argentine", "Armenian", "Australian",
  "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", "Belarusian", "Belarusian", "Belgian", "Belizean",
  "Beninese", "Bhutanese", "Bolivian", "Bosnian", "Botswanan", "Brazilian", "British", "Bruneian", "Bulgarian",
  "Burkinabe", "Burmese", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean", "Central African",
  "Chadian", "Chilean", "Chinese", "Colombian", "Comoran", "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot",
  "Czech", "Danish", "Djiboutian", "Dominican", "Dutch", "East Timorese", "Ecuadorian", "Egyptian", "Emirian", "Equatorial Guinean",
  "Eritrean", "Estonian", "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian",
  "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinean", "Guyanese", "Haitian", "Honduran", "Hungarian",
  "Icelandic", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Ivorian", "Jamaican",
  "Japanese", "Jordanian", "Kazakhstani", "Kenyan", "Kiribati", "Korean", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian",
  "Lebanese", "Liberian", "Libyan", "Liechtensteiner", "Lithuanian", "Luxembourg", "Macedonian", "Malagasy", "Malawian",
  "Malaysian", "Maldivian", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian",
  "Moldovan", "Monacan", "Mongolian", "Montenegrin", "Moroccan", "Mozambican", "Namibian", "Nauruan", "Nepalese",
  "New Zealand", "Nicaraguan", "Nigerian", "Norwegian", "Omani", "Pakistani", "Palauan", "Palestinian", "Panamanian",
  "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan",
  "Saint Lucian", "Salvadoran", "Samoan", "Saudi", "Senegalese", "Serbian", "Seychellois", "Sierra Leonean",
  "Singaporean", "Slovak", "Slovenian", "Solomon Islander", "Somali", "South African", "Spanish", "Sri Lankan",
  "Sudanese", "Surinamese", "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai",
  "Togolese", "Tongan", "Trinidadian", "Tunisian", "Turkish", "Turkmen", "Tuvaluan", "Ugandan", "Ukrainian",
  "Uruguayan", "Uzbek", "Vanuatuan", "Vatican", "Venezuelan", "Vietnamese", "Yemeni", "Zambian", "Zimbabwean"
];

const AddDebtorModal = ({ isOpen, onClose }: AddDebtorModalProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    nationality: "",
    email: "",
    phone: "",
    currency: "PLN",
    amount: "",
    description: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if debtor with same phone number exists
      const { data: existingDebtor } = await supabase
        .from("debtors")
        .select("id")
        .eq("phone_number", formData.phone)
        .maybeSingle();

      if (existingDebtor) {
        toast.error("A debtor with this phone number already exists");
        return;
      }

      // Create new debtor
      const names = formData.fullName.split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ");

      const { data: debtor, error: debtorError } = await supabase
        .from("debtors")
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: formData.email,
          phone_number: formData.phone,
          total_debt_amount: Number(formData.amount),
          total_debt_remaining: Number(formData.amount),
        })
        .select()
        .single();

      if (debtorError) {
        console.error("Error creating debtor:", debtorError);
        toast.error("Failed to create debtor");
        return;
      }

      // Create new case
      const { data: newCase, error: caseError } = await supabase
        .from("cases")
        .insert({
          debtor_id: debtor.id,
          case_number: `CASE-${Date.now()}`,
          creditor_name: "Your Company", // You might want to make this configurable
          currency: "PLN",
          debt_amount: Number(formData.amount),
          debt_remaining: Number(formData.amount),
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          case_description: formData.description,
        })
        .select()
        .single();

      if (caseError) {
        console.error("Error creating case:", caseError);
        toast.error("Failed to create case");
        return;
      }

      // Upload attachments if any
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileExt = file.name.split(".").pop();
          const filePath = `${newCase.id}/${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("case-attachments")
            .upload(filePath, file);

          if (uploadError) {
            console.error("Error uploading file:", uploadError);
            toast.error(`Failed to upload file: ${file.name}`);
            continue;
          }

          // Create attachment record
          const { error: attachmentError } = await supabase
            .from("case_attachments")
            .insert({
              case_id: newCase.id,
              file_name: file.name,
              storage_path: filePath,
              description: `Attachment for case ${newCase.case_number}`,
            });

          if (attachmentError) {
            console.error("Error creating attachment record:", attachmentError);
            toast.error(`Failed to record file: ${file.name}`);
            continue;
          }
        }
      }

      toast.success("Debtor added successfully");
      onClose();
      
      // Reset form
      setFormData({
        fullName: "",
        nationality: "",
        email: "",
        phone: "",
        currency: "PLN",
        amount: "",
        description: "",
      });
      setSelectedFiles([]);
      
    } catch (error) {
      console.error("Error adding debtor:", error);
      toast.error("Failed to add debtor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full h-full overflow-y-auto sm:max-w-[540px] p-0">
        <div className="p-6 h-full">
          <SheetHeader>
            <SheetTitle>Add a New Debtor</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700 block mb-1">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="nationality" className="text-sm font-medium text-gray-700 block mb-1">
                  Nationality
                </label>
                <Select value={formData.nationality} onValueChange={(value) => handleSelectChange("nationality", value)}>
                  <SelectTrigger id="nationality">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {nationalities.map((nationality) => (
                      <SelectItem key={nationality} value={nationality}>
                        {nationality}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="currency" className="text-sm font-medium text-gray-700 block mb-1">
                    Currency
                  </label>
                  <Select value={formData.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="amount" className="text-sm font-medium text-gray-700 block mb-1">
                    Debt Amount
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="10000.00"
                    required
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-1">
                  Description
                </label>
                <Textarea 
                  id="description" 
                  placeholder="Enter details about the debt..." 
                  className="resize-none" 
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="attachments" className="text-sm font-medium text-gray-700 block mb-1">
                  Attachments
                </label>
                <div className="mt-1">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="flex flex-col items-center">
                      <UploadCloud className="h-8 w-8 text-gray-400" />
                      <div className="mt-2 text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer text-blue-600 hover:text-blue-500">
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            multiple
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                          />
                        </label>
                        <span className="pl-1">or drag and drop</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX, PNG, JPG up to 10MB
                      </p>
                    </div>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 pb-12">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Debtor"}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddDebtorModal;
