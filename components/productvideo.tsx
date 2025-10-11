interface Props {
    product?: string;  // ممکنه string باشه یا undefined
}
export default function Productvideo({ product }: Props) {
    if (!product) return null; // اگر undefined بود هیچی رندر نمی‌کنه
    return (
        <video className="rounded-3xl" autoPlay muted loop playsInline>
            <source src={product} type="video/mp4" />
        </video>
    );
}